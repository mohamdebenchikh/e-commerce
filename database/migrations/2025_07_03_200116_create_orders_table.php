<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->string('client_name');
            $table->string('city');
            $table->string('address');
            $table->string('client_phone');
            $table->decimal('shipping_cost', 10, 2); // Added precision and scale
            $table->decimal('sale_price', 10, 2); // Added precision and scale
            $table->decimal('user_profit', 10, 2); // Added precision and scale
            $table->enum("status",['pending','confirmed','shipped','delivered','cancelled'])->default('pending'); // Added cancelled status
            $table->text('notes')->nullable(); // Added notes field
            $table->string('tracking_number')->nullable(); // Added tracking number
            $table->timestamp('estimated_delivery')->nullable(); // Added estimated delivery date
            $table->timestamps();
            $table->softDeletes(); // Added soft deletes
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
