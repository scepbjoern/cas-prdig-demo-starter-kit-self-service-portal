'use client'

// Formular für neue und bearbeitete Anträge.
// Der Starter-Kit-PLZ-Lookup gehört nicht zum Projektumfang.

import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { antragCreateSchema } from '@/lib/schemas/antrag'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

type AntragFormValues = {
  titel: string
  anbieter: string
  startdatum: string
  enddatum?: string
  kostenChf: string
  kostenstelle: string
  begruendung: string
  bemerkung?: string
}

interface AntragFormProps {
  mode: 'create' | 'edit'
  defaultValues?: Partial<AntragFormValues>
  action: (formData: FormData) => Promise<void>
  onCancel?: () => void
}

export function AntragForm({ mode, defaultValues, action, onCancel }: AntragFormProps) {
  const [isPending, startTransition] = useTransition()
  const form = useForm<AntragFormValues>({
    resolver: zodResolver(antragCreateSchema) as unknown as Resolver<AntragFormValues>,
    defaultValues: {
      titel: '',
      anbieter: '',
      startdatum: '',
      enddatum: undefined,
      kostenChf: '',
      kostenstelle: '',
      begruendung: '',
      bemerkung: undefined,
      ...defaultValues,
    },
  })

  const toFormValue = (value: unknown) => {
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10)
    }

    if (typeof value === 'number') {
      return String(value)
    }

    return typeof value === 'string' ? value : ''
  }

  const onSubmit = (values: AntragFormValues) => {
    startTransition(async () => {
      const fd = new FormData()
      fd.set('titel', toFormValue(values.titel))
      fd.set('anbieter', toFormValue(values.anbieter))
      fd.set('startdatum', toFormValue(values.startdatum))
      fd.set('kostenChf', toFormValue(values.kostenChf))
      fd.set('kostenstelle', toFormValue(values.kostenstelle))
      fd.set('begruendung', toFormValue(values.begruendung))
      if (values.enddatum) fd.set('enddatum', toFormValue(values.enddatum))
      if (values.bemerkung) fd.set('bemerkung', toFormValue(values.bemerkung))
      try {
        await action(fd)
        toast.success(mode === 'create' ? 'Entwurf gespeichert' : 'Entwurf gespeichert')
      } catch (err: unknown) {
        // Next.js redirect() wirft einen speziellen NEXT_REDIRECT-Fehler, der den Router erreichen muss
        if ((err as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) throw err
        toast.error(err instanceof Error ? err.message : 'Fehler beim Speichern')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="titel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titel</FormLabel>
              <FormControl>
                <Input placeholder="Titel des Antrags" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="anbieter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anbieter</FormLabel>
              <FormControl>
                <Input placeholder="Weiterbildungsanbieter" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="startdatum"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Startdatum</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="enddatum"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enddatum (optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="kostenChf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kosten in CHF</FormLabel>
                <FormControl>
                  <Input type="number" min="0" max="50000" step="0.05" placeholder="5900.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="kostenstelle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kostenstelle</FormLabel>
                <FormControl>
                  <Input placeholder="WB-1000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="begruendung"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Begruendung</FormLabel>
              <FormControl>
                <Textarea placeholder="Warum ist die Weiterbildung fachlich sinnvoll?" rows={6} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bemerkung"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bemerkung (optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Zusätzliche Hinweise fuer die Demo oder Rueckfragen" rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Speichern...' : mode === 'create' ? 'Entwurf speichern' : 'Entwurf speichern'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Abbrechen
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
