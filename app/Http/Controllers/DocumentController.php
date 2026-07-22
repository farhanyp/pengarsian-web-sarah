<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Document::query()->with(['creator', 'incomingMail', 'outgoingMail']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where('title', 'like', "%{$search}%");
        }

        // Apply sorting, defaulting to latest
        $query->latest();

        $documents = $query->paginate(10)->withQueryString();

        return Inertia::render('dokumen/Index', [
            'documents' => $documents,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'file' => 'required|file|max:10240', // max 10MB
            'type' => 'required|in:masuk,keluar',
        ]);

        try {
            \Illuminate\Support\Facades\DB::beginTransaction();

            $file = $request->file('file');
            $path = $file->store('documents', 'public');

            $document = Document::create([
                'title' => $request->title,
                'status' => \App\Enums\StatusDocument::ARCHIVED, // Assuming default archived
                'recipient_type' => \App\Enums\RecipientType::EXTERNAL, // Default external per ERD
                'current_url' => $path,
                'created_by' => auth()->id() ?? User::first()->id, // Fallback if not logged in
            ]);

            if ($request->type === 'masuk') {
                \App\Models\IncomingMail::create([
                    'document_id' => $document->id,
                    'received_at' => now(),
                ]);
            } else {
                \App\Models\OutgoingMail::create([
                    'document_id' => $document->id,
                    'sent_at' => now(),
                ]);
            }

            // Also track in history
            \App\Models\DocumentHistory::create([
                'document_id' => $document->id,
                'file_path' => $path,
                'version_name' => \App\Enums\StatusDocument::ARCHIVED,
                'note' => 'Initial upload',
                'created_by' => auth()->id() ?? User::first()->id,
                'created_at' => now(),
            ]);

            \Illuminate\Support\Facades\DB::commit();

            return back()->with('success', 'Dokumen berhasil diunggah.');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return back()->withErrors(['error' => 'Gagal mengunggah dokumen: ' . $e->getMessage()]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Document $document)
    {
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $document->update([
            'title' => $request->title,
        ]);

        return back()->with('success', 'Dokumen berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Document $document)
    {
        try {
            \Illuminate\Support\Facades\DB::beginTransaction();

            // Delete from public storage
            if ($document->current_url && \Illuminate\Support\Facades\Storage::disk('public')->exists($document->current_url)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($document->current_url);
            }

            // Delete all historical files from storage
            foreach ($document->history as $history) {
                if ($history->file_path && \Illuminate\Support\Facades\Storage::disk('public')->exists($history->file_path)) {
                    \Illuminate\Support\Facades\Storage::disk('public')->delete($history->file_path);
                }
            }

            // Cascade delete will automatically delete from DB
            $document->delete();

            \Illuminate\Support\Facades\DB::commit();

            return back()->with('success', 'Dokumen berhasil dihapus.');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return back()->withErrors(['error' => 'Gagal menghapus dokumen: ' . $e->getMessage()]);
        }
    }
}
