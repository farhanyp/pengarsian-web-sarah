<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IncomingMail extends Model
{
    use HasFactory;

    protected $table = 'incoming_mail';
    public $timestamps = false;

    protected $fillable = [
        'document_id',
        'received_at'
    ];

    protected $casts = [
        'received_at' => 'datetime',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }
}
