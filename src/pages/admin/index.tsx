import React, { FC, useEffect, useState, useRef } from 'react'
import {
  Box, Button, Chip, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, IconButton, InputAdornment, Paper,
  Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Tabs, TextField, Tooltip, Typography, Avatar,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import DownloadIcon from '@mui/icons-material/Download'
import LogoutIcon from '@mui/icons-material/Logout'
import { Gift, GiftStatus } from '@/interfaces/gifts'

// ─── Auth ────────────────────────────────────────────────────────────────────

const LoginScreen: FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    setLoading(false)
    if (res.ok) {
      onLogin()
    } else {
      setError('Senha incorreta')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Paper sx={{ p: 4, width: 340 }}>
        <Typography variant="h5" mb={3} textAlign="center">Admin</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Senha"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" fullWidth disabled={loading}>
            {loading ? <CircularProgress size={22} /> : 'Entrar'}
          </Button>
        </form>
      </Paper>
    </Box>
  )
}

// ─── Gift Form Modal ──────────────────────────────────────────────────────────

type GiftFormData = {
  name: string
  description: string
  cost: string
  link: string
  picture: string
}

const emptyForm: GiftFormData = { name: '', description: '', cost: '', link: '', picture: '' }

const GiftModal: FC<{
  open: boolean
  initial?: Gift
  onClose: () => void
  onSave: (data: GiftFormData) => Promise<void>
}> = ({ open, initial, onClose, onSave }) => {
  const [form, setForm] = useState<GiftFormData>(emptyForm)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setForm(
      initial
        ? { name: initial.name, description: initial.description, cost: String(initial.cost), link: initial.link, picture: initial.picture }
        : emptyForm
    )
  }, [open, initial])

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve((reader.result as string).split(',')[1])
      reader.readAsDataURL(file)
    })
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64, fileName: file.name, mimeType: file.type }),
    })
    const data = await res.json()
    setUploading(false)
    if (data.url) setForm((f) => ({ ...f, picture: data.url }))
  }

  const handleSave = async () => {
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial ? 'Editar Presente' : 'Novo Presente'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Nome *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} fullWidth />
          <TextField label="Descrição" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} fullWidth multiline rows={2} />
          <TextField
            label="Custo (R$)"
            value={form.cost}
            onChange={(e) => setForm((f) => ({ ...f, cost: e.target.value }))}
            type="number"
            InputProps={{ startAdornment: <InputAdornment position="start">R$</InputAdornment> }}
          />
          <TextField label="Link" value={form.link} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} fullWidth />

          <Box>
            <Typography variant="body2" mb={1}>Foto</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              {form.picture && (
                <Avatar src={form.picture} variant="rounded" sx={{ width: 80, height: 80 }} />
              )}
              <Button variant="outlined" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? <CircularProgress size={18} /> : 'Upload'}
              </Button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
            </Stack>
            {form.picture && (
              <TextField
                label="URL da foto"
                value={form.picture}
                onChange={(e) => setForm((f) => ({ ...f, picture: e.target.value }))}
                fullWidth
                sx={{ mt: 1 }}
                size="small"
              />
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving || !form.name}>
          {saving ? <CircularProgress size={18} /> : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

const DeleteConfirm: FC<{ name: string; onConfirm: () => void; onClose: () => void }> = ({ name, onConfirm, onClose }) => (
  <Dialog open onClose={onClose}>
    <DialogTitle>Remover presente</DialogTitle>
    <DialogContent>
      <Typography>Tem certeza que deseja remover <strong>{name}</strong>?</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancelar</Button>
      <Button color="error" variant="contained" onClick={onConfirm}>Remover</Button>
    </DialogActions>
  </Dialog>
)

// ─── RSVP types ───────────────────────────────────────────────────────────────

type Rsvp = {
  id: string
  name: string
  attending: boolean | null
  adults: number
  children: number
  dietary_restrictions: string | null
  song: string | null
  created_at: string
}

// ─── Presences Tab ────────────────────────────────────────────────────────────

const PresencesTab: FC = () => {
  const [rsvps, setRsvps] = useState<Rsvp[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/rsvps')
      .then((r) => r.json())
      .then((d) => { setRsvps(d); setLoading(false) })
  }, [])

  const confirmed = rsvps.filter((r) => r.attending)
  const totalAdults = confirmed.reduce((s, r) => s + (r.adults || 0), 0)
  const totalChildren = confirmed.reduce((s, r) => s + (r.children || 0), 0)

  const exportCSV = () => {
    const header = 'Nome,Comparecerá,Adultos,Crianças,Restrições Alimentares,Música'
    const rows = rsvps.map((r) =>
      [
        r.name,
        r.attending === true ? 'Sim' : r.attending === false ? 'Não' : '—',
        r.adults,
        r.children,
        r.dietary_restrictions ?? '',
        r.song ?? '',
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'presencas.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      {/* Resumo */}
      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap">
        <Paper sx={{ px: 3, py: 2, minWidth: 130 }}>
          <Typography variant="h4" fontWeight={700}>{confirmed.length}</Typography>
          <Typography variant="body2" color="text.secondary">Confirmados</Typography>
        </Paper>
        <Paper sx={{ px: 3, py: 2, minWidth: 130 }}>
          <Typography variant="h4" fontWeight={700}>{rsvps.filter((r) => r.attending === false).length}</Typography>
          <Typography variant="body2" color="text.secondary">Não vão</Typography>
        </Paper>
        <Paper sx={{ px: 3, py: 2, minWidth: 130 }}>
          <Typography variant="h4" fontWeight={700}>{totalAdults}</Typography>
          <Typography variant="body2" color="text.secondary">Adultos confirmados</Typography>
        </Paper>
        <Paper sx={{ px: 3, py: 2, minWidth: 130 }}>
          <Typography variant="h4" fontWeight={700}>{totalChildren}</Typography>
          <Typography variant="body2" color="text.secondary">Crianças confirmadas</Typography>
        </Paper>
      </Stack>

      <Stack direction="row" justifyContent="flex-end" mb={2}>
        {rsvps.length > 0 && (
          <Button startIcon={<DownloadIcon />} variant="outlined" size="small" onClick={exportCSV}>
            Exportar CSV
          </Button>
        )}
      </Stack>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Presença</TableCell>
              <TableCell>Adultos</TableCell>
              <TableCell>Crianças</TableCell>
              <TableCell>Restrições Alimentares</TableCell>
              <TableCell>Música</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rsvps.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  Nenhuma resposta ainda
                </TableCell>
              </TableRow>
            )}
            {rsvps.map((rsvp, i) => (
              <TableRow key={rsvp.id} hover>
                <TableCell sx={{ color: 'text.secondary', width: 40 }}>{i + 1}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>{rsvp.name}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={rsvp.attending === true ? 'Sim' : rsvp.attending === false ? 'Não' : '—'}
                    color={rsvp.attending === true ? 'success' : rsvp.attending === false ? 'error' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{rsvp.adults || '—'}</TableCell>
                <TableCell>{rsvp.children || '—'}</TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {rsvp.dietary_restrictions || '—'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {rsvp.song || '—'}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

// ─── Claims Tab ───────────────────────────────────────────────────────────────

const ClaimsTab: FC<{ gifts: Gift[]; loading: boolean }> = ({ gifts, loading }) => {
  const claimed = gifts.filter((g) => g.claimedByName)

  const exportCSV = () => {
    const header = 'Presente,Valor,Resgatado por,Email'
    const rows = claimed.map((g) =>
      [g.name, `R$ ${g.cost.toFixed(2)}`, g.claimedByName ?? '', g.claimedByEmail ?? '']
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resgates.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="body2" color="text.secondary">
          {claimed.length} presente{claimed.length !== 1 ? 's' : ''} resgatado{claimed.length !== 1 ? 's' : ''}
        </Typography>
        {claimed.length > 0 && (
          <Button startIcon={<DownloadIcon />} variant="outlined" size="small" onClick={exportCSV}>
            Exportar CSV
          </Button>
        )}
      </Stack>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Presente</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Resgatado por</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {claimed.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  Nenhum presente resgatado ainda
                </TableCell>
              </TableRow>
            )}
            {claimed.map((gift, i) => (
              <TableRow key={gift.id} hover>
                <TableCell sx={{ color: 'text.secondary', width: 40 }}>{i + 1}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar src={gift.picture} variant="rounded" sx={{ width: 36, height: 36 }} />
                    <Typography variant="body2" fontWeight={600}>{gift.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>R$ {gift.cost.toFixed(2)}</TableCell>
                <TableCell>
                  <Typography variant="body2">{gift.claimedByName}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">{gift.claimedByEmail}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

const Dashboard: FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Gift | undefined>()
  const [deleting, setDeleting] = useState<Gift | undefined>()

  const loadGifts = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/gifts')
    const data = await res.json()
    setGifts(data)
    setLoading(false)
  }

  useEffect(() => { loadGifts() }, [])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    onLogout()
  }

  const handleSave = async (form: GiftFormData) => {
    const body = { name: form.name, description: form.description, cost: Number(form.cost), link: form.link, picture: form.picture }
    if (editing) {
      await fetch(`/api/admin/gifts/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } else {
      await fetch('/api/admin/gifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    }
    setModalOpen(false)
    setEditing(undefined)
    loadGifts()
  }

  const handleDelete = async () => {
    if (!deleting) return
    await fetch(`/api/admin/gifts/${deleting.id}`, { method: 'DELETE' })
    setDeleting(undefined)
    loadGifts()
  }

  const exportCSV = () => {
    const header = 'Nome,Custo,Status,Resgatado por,Email'
    const rows = gifts.map((g) =>
      [g.name, g.cost, g.status, g.claimedByName ?? '', g.claimedByEmail ?? '']
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(',')
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'presentes.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const claimed = gifts.filter((g) => g.status === GiftStatus.Claimed).length

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4">Painel Admin</Typography>
          <Typography variant="body2" color="text.secondary">
            {claimed} de {gifts.length} presentes resgatados
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          {tab === 0 && (
            <>
              <Button startIcon={<DownloadIcon />} variant="outlined" onClick={exportCSV}>
                Exportar CSV
              </Button>
              <Button startIcon={<AddIcon />} variant="contained" onClick={() => { setEditing(undefined); setModalOpen(true) }}>
                Adicionar
              </Button>
            </>
          )}
          <Tooltip title="Sair">
            <IconButton onClick={handleLogout}><LogoutIcon /></IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Tabs */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Presentes" />
        <Tab label={`Resgates${claimed > 0 ? ` (${claimed})` : ''}`} />
        <Tab label="Presenças" />
      </Tabs>

      {/* Tab: Presentes */}
      {tab === 0 && (
        loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Foto</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Custo</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gifts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      Nenhum presente cadastrado
                    </TableCell>
                  </TableRow>
                )}
                {gifts.map((gift) => (
                  <TableRow key={gift.id} hover>
                    <TableCell>
                      <Avatar src={gift.picture} variant="rounded" sx={{ width: 48, height: 48 }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{gift.name}</Typography>
                      {gift.description && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {gift.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>R$ {gift.cost.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={gift.status === GiftStatus.Claimed ? 'Resgatado' : 'Disponível'}
                        color={gift.status === GiftStatus.Claimed ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => { setEditing(gift); setModalOpen(true) }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => setDeleting(gift)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}

      {/* Tab: Resgates */}
      {tab === 1 && <ClaimsTab gifts={gifts} loading={loading} />}

      {/* Tab: Presenças */}
      {tab === 2 && <PresencesTab />}

      <GiftModal
        open={modalOpen}
        initial={editing}
        onClose={() => { setModalOpen(false); setEditing(undefined) }}
        onSave={handleSave}
      />

      {deleting && (
        <DeleteConfirm
          name={deleting.name}
          onConfirm={handleDelete}
          onClose={() => setDeleting(undefined)}
        />
      )}
    </Box>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const AdminPage: FC = () => {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    fetch('/api/admin/gifts').then((res) => {
      setAuthenticated(res.status !== 401)
    })
  }, [])

  if (authenticated === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!authenticated) {
    return <LoginScreen onLogin={() => setAuthenticated(true)} />
  }

  return <Dashboard onLogout={() => setAuthenticated(false)} />
}

export default AdminPage
