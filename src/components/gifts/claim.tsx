import React, { FC, useEffect, useState } from 'react'
import { Alert, Box, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, TextField, Typography } from '@mui/material'
import { Gift, GiftStatus } from '@/interfaces/gifts'
import SingleGift from './gift'

type GiftsHeroProps = {
  gifts: Gift[]
}

const GiftsClaim: FC<GiftsHeroProps> = ({ gifts }: GiftsHeroProps) => {
  const [currentGifts, setCurrentGifts] = useState(gifts)
  const [selected, setSelected] = useState<Gift | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [busy, setBusy] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loadingGifts, setLoadingGifts] = useState(gifts.length === 0)
  const [loadError, setLoadError] = useState(false)

  const refreshGifts = async () => {
    try {
      const res = await fetch('/api/gifts', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load gifts')
      const data = await res.json()
      if (Array.isArray(data)) setCurrentGifts(data)
      setLoadError(false)
    } catch {
      setLoadError(true)
    } finally {
      setLoadingGifts(false)
    }
  }

  useEffect(() => {
    refreshGifts()
  }, [])

  const choose = (gift: Gift) => {
    setSelected(gift)
    setName('')
    setEmail('')
    setWebsite('')
    setSuccess(false)
    setError('')
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!selected) return
    setBusy(true)
    setError('')
    try {
      const res = await fetch(`/api/gifts/${selected.id}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, website }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Não foi possível escolher o presente.')
      setSuccess(true)
      setCurrentGifts((previous) => previous.map((gift) =>
        gift.id === selected.id ? { ...gift, status: GiftStatus.Claimed } : gift
      ))
      refreshGifts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível escolher o presente.')
      refreshGifts()
    } finally {
      setBusy(false)
    }
  }

  return (
    <Box id="hero" sx={{ backgroundColor: 'background.paper', py: 5 }}>
      <Container maxWidth="lg">
        {loadError && (
          <Alert severity="error" sx={{ mb: 3 }} action={<Button color="inherit" size="small" onClick={refreshGifts}>Tentar novamente</Button>}>
            Não foi possível atualizar a lista de presentes.
          </Alert>
        )}
        <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
          {loadingGifts && currentGifts.length === 0 ? (
            <Grid size={12} sx={{ textAlign: 'center' }}><CircularProgress aria-label="Carregando presentes" /></Grid>
          ) : currentGifts.length === 0 && !loadError ? (
            <Grid size={12}>
              <Typography align="center" color="text.secondary">
                Nenhum presente disponível no momento.
              </Typography>
            </Grid>
          ) : (
            currentGifts.map((gift) => (
              <Grid key={gift.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <SingleGift gift={gift} onSelect={choose} />
              </Grid>
            ))
          )}
        </Grid>
      </Container>
      <Dialog open={!!selected} onClose={busy ? undefined : () => setSelected(null)} fullWidth maxWidth="sm">
        <DialogTitle>{selected?.name}</DialogTitle>
        {success ? (
          <>
            <DialogContent>
              <Alert severity="success">Presente escolhido! Obrigado pelo carinho.</Alert>
            </DialogContent>
            <DialogActions><Button onClick={() => setSelected(null)}>Fechar</Button></DialogActions>
          </>
        ) : (
          <>
            <DialogContent>
              <Box component="form" id="gift-form" onSubmit={submit}>
                <Stack spacing={2.5} sx={{ pt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Confirme seus dados para escolher este presente. Ele ficará indisponível para outras pessoas.
                  </Typography>
                  <TextField label="Nome completo" value={name} onChange={(e) => setName(e.target.value)} required fullWidth inputProps={{ maxLength: 120 }} />
                  <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth inputProps={{ maxLength: 254 }} />
                  <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-10000px' }} />
                  {error && <Alert severity="error">{error}</Alert>}
                </Stack>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelected(null)} disabled={busy}>Cancelar</Button>
              <Button type="submit" form="gift-form" variant="contained" disabled={busy}>
                {busy ? <CircularProgress size={20} /> : 'Escolher presente'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  )
}

export default GiftsClaim
