<?php

namespace App\Models;

use App\Enums\RecipientType;
use App\Enums\StatusDocument;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Document extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'title',
        'status',
        'recipient_type',
        'current_url',
        'created_by'
    ];

    protected $casts = [
        'status' => StatusDocument::class,
        'recipient_type' => RecipientType::class,
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function history(): HasMany
    {
        return $this->hasMany(DocumentHistory::class);
    }

    public function outgoingMail(): HasOne
    {
        return $this->hasOne(OutgoingMail::class);
    }

    public function incomingMail(): HasOne
    {
        return $this->hasOne(IncomingMail::class);
    }
}
