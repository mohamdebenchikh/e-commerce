import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function TestProducts() {
    const { props } = usePage();
    
    return (
        <AppLayout>
            <Head title="Test Products" />
            
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold mb-4">Test Products Debug</h1>
                
                <div className="bg-gray-100 p-4 rounded">
                    <h2 className="text-lg font-semibold mb-2">Props Data:</h2>
                    <pre className="text-sm overflow-auto">
                        {JSON.stringify(props, null, 2)}
                    </pre>
                </div>
            </div>
        </AppLayout>
    );
}
