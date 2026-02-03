import { WeddingConfigType } from '@/interfaces/config'

const weddingConfig: WeddingConfigType = {
  people: {
    bride: { firstName: 'Letícia', lastName: 'Santoriano' },
    groom: { firstName: 'Rafael', lastName: 'Telles' },
  },
  date: {
    date: '2026-11-21',
    time: '16:30', // Optional
  },
  location: {
    title: 'Paróquia Nossa Senhora do Carmo',
    address: 'R. Gen. Vasco Alves, 2598 - Centro, Uruguaiana - RS',
    link: 'https://www.google.com/maps/place/Par%C3%B3quia+Nossa+Senhora+do+Carmo/@-29.749904,-57.0873405,18.25z/data=!4m6!3m5!1s0x94535b59819b171f:0x39651aedbc91671c!8m2!3d-29.7499107!4d-57.0873417!16s%2Fg%2F11clt9q27p?entry=ttu&g_ep=EgoyMDI2MDEyOC4wIKXMDSoKLDEwMDc5MjA3MUgBUAM%3D',
    latLng: '-29.749712, -57.087408',
  },
}

export default weddingConfig
