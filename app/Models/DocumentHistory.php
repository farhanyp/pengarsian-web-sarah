<?php

namespace App\Models;

use App\Enums\StatusDocument;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentHistory extends Model
{
    use HasFactory;

    protected $table = 'document_history';
    public $timestamps = false;

    protected $fillable = [
        'document_id',
        'file_path',
        'version_name',
        'note',
        'created_by',
        'created_at'
    ];

    protected $casts = [
        'version_name' => StatusDocument::class,
        'created_at' => 'datetime',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
