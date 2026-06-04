'use client'

// Formular für neue und bearbeitete Anträge.
// Der Starter-Kit-PLZ-Lookup gehört nicht zum Projektumfang.

import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { antragCreateSchema } from '@/lib/schemas/antrag'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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
  onSaveDraft: (formData: FormData) => Promise<void>
  onSubmitFinal: (formData: FormData) => Promise<void>
  onCancel?: () => void
}

export function AntragForm({ mode, defaultValues, onSaveDraft, onSubmitFinal, onCancel }: AntragFormProps) {
  const [isPending, startTransition] = useTransition()
  const [dialogOpen, setDialogOpen] = useState(false)
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

  const buildFormData = (values: AntragFormValues) => {
    const fd = new FormData()
    fd.set('titel', toFormValue(values.titel))
    fd.set('anbieter', toFormValue(values.anbieter))
    fd.set('startdatum', toFormValue(values.startdatum))
    fd.set('kostenChf', toFormValue(values.kostenChf))
    fd.set('kostenstelle', toFormValue(values.kostenstelle))
    fd.set('begruendung', toFormValue(values.begruendung))
    if (values.enddatum) fd.set('enddatum', toFormValue(values.enddatum))
    if (values.bemerkung) fd.set('bemerkung', toFormValue(values.bemerkung))
    return fd
  }

  const handleDraftClick = form.handleSubmit((values) => {
    startTransition(async () => {
      try {
        await onSaveDraft(buildFormData(values))
        toast.success('Entwurf gespeichert')
      } catch (err: unknown) {
        if ((err as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) throw err
        toast.error(err instanceof Error ? err.message : 'Fehler beim Speichern')
      }
    })
  })

  const handleFinalClick = async () => {
    const isValid = await form.trigger()
    if (isValid) {
      setDialogOpen(true)
    }
  }

  const handleConfirmFinal = form.handleSubmit((values) => {
    setDialogOpen(false)
    startTransition(async () => {
      try {
        await onSubmitFinal(buildFormData(values))
        toast.success('Antrag eingereicht')
      } catch (err: unknown) {
        if ((err as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) throw err
        toast.error(err instanceof Error ? err.message : 'Fehler beim Einreichen')
      }
    })
  })

  return (
    <Form {...form}>
      <form className="space-y-4">
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
          <Button type="button" onClick={handleDraftClick} disabled={isPending}>
            {isPending ? 'Speichern...' : 'Entwurf speichern'}
          </Button>
          <Button type="button" variant="default" onClick={handleFinalClick} disabled={isPending}>
            Speichern und einreichen
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Abbrechen
            </Button>
          )}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Antrag verbindlich einreichen?</DialogTitle>
              <DialogDescription>
                Der Antrag wechselt in den Status Eingereicht und kann danach nicht mehr bearbeitet werden.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button type="button" onClick={handleConfirmFinal}>
                Ja, einreichen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  )
}
