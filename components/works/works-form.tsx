"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { CreateWorkInput } from "@/types";

const workSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  client: z.string().optional(),
  description: z.string().optional(),
  start_date: z.string().min(1, "La fecha de inicio es obligatoria"),
  due_date: z.string().min(1, "La fecha de entrega es obligatoria"),
  actual_end_date: z.string().optional(),
  latitude: z.string().optional().refine(
    (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= -90 && parseFloat(val) <= 90),
    { message: "La latitud debe estar entre -90 y 90" }
  ),
  longitude: z.string().optional().refine(
    (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= -180 && parseFloat(val) <= 180),
    { message: "La longitud debe estar entre -180 y 180" }
  ),
});

type WorkFormValues = z.infer<typeof workSchema>;

interface WorksFormProps {
  initialValues?: Partial<CreateWorkInput>;
  onSubmit: (values: CreateWorkInput) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

function DatePickerField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <FormItem className="flex flex-col">
      <FormLabel>{label}</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <button
              type="button"
              className={cn(
                "flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                !value && "text-muted-foreground"
              )}
            />
          }
          onClick={() => setOpen(!open)}
        >
          {value ? (
            format(new Date(value), "PPP")
          ) : (
            <span>{placeholder || "Pick a date"}</span>
          )}
          <CalendarIcon className="h-4 w-4 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={(date) => {
              onChange(date?.toISOString().split("T")[0] || "");
              setOpen(false);
            }}
            disabled={(date) => date < new Date("1900-01-01")}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </FormItem>
  );
}

export function WorksForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading,
}: WorksFormProps) {
  const form = useForm<WorkFormValues>({
    resolver: zodResolver(workSchema),
    defaultValues: {
      name: initialValues?.name || "",
      client: initialValues?.client || "",
      description: initialValues?.description || "",
      start_date: initialValues?.start_date || "",
      due_date: initialValues?.due_date || "",
      actual_end_date: initialValues?.actual_end_date || "",
    },
  });

  const handleSubmit = async (values: WorkFormValues) => {
    const lat = values.latitude ? parseFloat(values.latitude) : undefined;
    const lon = values.longitude ? parseFloat(values.longitude) : undefined;
    
    const submitValues: CreateWorkInput = {
      name: values.name,
      client: values.client || undefined,
      description: values.description || undefined,
      start_date: values.start_date,
      due_date: values.due_date,
      actual_end_date: values.actual_end_date || undefined,
      latitude: lat !== undefined && !isNaN(lat) ? lat : undefined,
      longitude: lon !== undefined && !isNaN(lon) ? lon : undefined,
    };
    await onSubmit(submitValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre *</FormLabel>
              <FormControl>
                <Input placeholder="Ingresá el nombre de la obra" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="client"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del cliente (opcional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción de la obra (opcional)"
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <DatePickerField
                label="Fecha de Inicio *"
                value={field.value}
                onChange={field.onChange}
                placeholder="Elegí una fecha"
              />
            )}
          />

          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <DatePickerField
                label="Fecha de Entrega *"
                value={field.value}
                onChange={field.onChange}
                placeholder="Elegí una fecha"
              />
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="actual_end_date"
          render={({ field }) => (
            <DatePickerField
              label="Fecha Real de Entrega (dejar vacío si está en progreso)"
              value={field.value || ""}
              onChange={field.onChange}
              placeholder="No completada todavía"
            />
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitud</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="any"
                    placeholder="-34.6037" 
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitud</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="any"
                    placeholder="-58.3816" 
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <p className="text-xs text-muted-foreground -mt-4">
          Encontrá las coordenadas en Google Maps haciendo click derecho en la ubicación
        </p>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar"}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
