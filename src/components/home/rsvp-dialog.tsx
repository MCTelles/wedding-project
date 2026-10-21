import React, { FC, useState } from 'react'
import {
  Alert, Box, Button, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel,
  Radio, RadioGroup, Stack, TextField, Typography,
} from '@mui/material'

type Props = { open: boolean; onClose: () => void }

const RsvpDialog: FC<Props> = ({ open, onClose }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [attending, setAttending] = useState('')
  const [adults, setAdults] = useState('1')
  const [children, setChildren] = useState('0')
  const [dietary, setDietary] = useState('')
  const [song, setSong] = useState('')
  const [website, setWebsite] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const close = () => {
    setSaved(false)
    setError('')
    onClose()
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      const normalizedEmail = email.trim().toLowerCase()
      const storageKey = `wedding-rsvp-edit:${normalizedEmail}`
      let editToken = window.localStorage.getItem(storageKey)
      if (!editToken) {
        editToken = window.crypto.randomUUID()
        window.localStorage.setItem(storageKey, editToken)
      }
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email: normalizedEmail, attending: attending === 'yes',
          adults: Number(adults), children: Number(children), dietary, song,
          website, editToken,
        }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Não foi possível salvar sua resposta.')
      setSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar sua resposta.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onClose={busy ? undefined : close} fullWidth maxWidth="sm">
      <DialogTitle>Confirmação de presença</DialogTitle>
      {saved ? (
        <>
          <DialogContent>
            <Alert severity="success">Sua resposta foi salva. Obrigado!</Alert>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Se precisar alterar, abra este formulário no mesmo navegador e envie novamente.
            </Typography>
          </DialogContent>
          <DialogActions><Button onClick={close}>Fechar</Button></DialogActions>
        </>
      ) : (
        <>
          <DialogContent>
            <Box component="form" id="rsvp-form" onSubmit={submit}>
              <Stack spacing={2.5} sx={{ pt: 1 }}>
                <TextField label="Nome completo" value={name} onChange={(e) => setName(e.target.value)} required fullWidth inputProps={{ maxLength: 120 }} />
                <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth inputProps={{ maxLength: 254 }} />
                <FormControl required>
                  <FormLabel>Você irá ao casamento?</FormLabel>
                  <RadioGroup value={attending} onChange={(e) => setAttending(e.target.value)} row>
                    <FormControlLabel value="yes" control={<Radio />} label="Sim" />
                    <FormControlLabel value="no" control={<Radio />} label="Não" />
                  </RadioGroup>
                </FormControl>
                {attending === 'yes' && (
                  <>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField label="Adultos, incluindo você" type="number" value={adults} onChange={(e) => setAdults(e.target.value)} required fullWidth inputProps={{ min: 0, max: 20 }} />
                      <TextField label="Crianças" type="number" value={children} onChange={(e) => setChildren(e.target.value)} required fullWidth inputProps={{ min: 0, max: 20 }} />
                    </Stack>
                    <TextField label="Restrições alimentares" value={dietary} onChange={(e) => setDietary(e.target.value)} fullWidth multiline minRows={2} inputProps={{ maxLength: 500 }} />
                    <TextField label="Sugestão de música" value={song} onChange={(e) => setSong(e.target.value)} fullWidth inputProps={{ maxLength: 200 }} />
                  </>
                )}
                <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-10000px' }} />
                {error && <Alert severity="error">{error}</Alert>}
              </Stack>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={close} disabled={busy}>Cancelar</Button>
            <Button type="submit" form="rsvp-form" variant="contained" disabled={busy || !attending}>
              {busy ? <CircularProgress size={20} /> : 'Enviar resposta'}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  )
}

export default RsvpDialog
