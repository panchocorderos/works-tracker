"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WorksForm } from "@/components/works/works-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWork, updateWork } from "@/lib/actions/works";
import { CreateWorkInput, UpdateWorkInput, WorkWithCalculations } from "@/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface EditWorkPageProps {
  params: Promise<{ id: string }>;
}

export default function EditWorkPage({ params }: EditWorkPageProps) {
  const [work, setWork] = useState<WorkWithCalculations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    getWork(id).then((w) => {
      setWork(w);
      setIsLoading(false);
    });
  }, [id]);

  const handleSubmit = async (values: CreateWorkInput) => {
    const input: UpdateWorkInput = {
      id,
      ...values,
    };
    const result = await updateWork(input);
    if (result?.error) {
      throw new Error(result.error);
    }
    router.push("/works");
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl">
        <div className="mb-6">
          <div className="h-8 w-32 bg-muted animate-pulse rounded mb-4" />
          <div className="h-10 w-64 bg-muted animate-pulse rounded" />
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!work) {
    return (
      <div className="max-w-2xl text-center py-12">
        <p className="text-muted-foreground">Obra no encontrada</p>
        <Link href="/works" className="text-primary underline mt-2 inline-block">
          Volver a Obras
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/works"
          className="inline-flex h-7 items-center gap-1 rounded-md px-2.5 text-sm hover:bg-muted hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Obras
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Editar Obra</h1>
        <p className="text-muted-foreground mt-1">
          Actualiza los detalles de tu obra
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Obra</CardTitle>
        </CardHeader>
        <CardContent>
          <WorksForm
            initialValues={{
              name: work.name,
              client: work.client || undefined,
              description: work.description || undefined,
              start_date: work.start_date,
              due_date: work.due_date,
              actual_end_date: work.actual_end_date || undefined,
            }}
            onSubmit={handleSubmit}
            onCancel={() => router.push("/works")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
