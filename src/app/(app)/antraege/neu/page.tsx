import { requireRole } from '@/lib/auth-helpers'
import { AntragForm } from '@/components/antraege/antrag-form'
import { createAntrag, createAntragAndSubmit } from '../actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export default async function NeuAntragPage() {
  await requireRole(['user_applicant', 'admin'])

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/antraege">
            <ChevronLeft className="h-4 w-4" />
            Zurück
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Neuer Weiterbildungsantrag</h1>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <AntragForm 
          mode="create" 
          onSaveDraft={createAntrag} 
          onSubmitFinal={createAntragAndSubmit} 
        />
      </div>
    </div>
  )
}
