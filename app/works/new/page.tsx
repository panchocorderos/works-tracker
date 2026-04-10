"use client";

import { WorksForm } from "@/components/works/works-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createWork } from "@/lib/actions/works";
import { CreateWorkInput } from "@/types";

export default function NewWorkPage() {
  const handleSubmit = async (values: CreateWorkInput) => {
    await createWork(values);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Nueva Obra</h1>
        <p className="text-muted-foreground mt-1">
          Crea una nueva obra para gestionar
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Obra</CardTitle>
        </CardHeader>
        <CardContent>
          <WorksForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
}
