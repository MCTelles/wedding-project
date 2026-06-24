export interface Gift {
    id: string
    name: string
    description: string
    cost: number
    picture: string
    link: string
    status: GiftStatus
    claimedByName?: string | null
    claimedByEmail?: string | null
}

export enum GiftStatus {
    Claimed = 'Claimed',
    NotClaimed = 'Not Claimed',
}