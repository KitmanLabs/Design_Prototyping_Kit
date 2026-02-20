// Mock data for messaging – no backend

export const currentUserId = 'current-user'

export const mockUsers = [
  { id: 'current-user', name: 'Tymofii Antoniuk', role: 'Staff', isChannelAdmin: false },
  { id: 'u1', name: 'cmgandroidtest241119-1 Android Test', role: 'Athlete', isChannelAdmin: false },
  { id: 'u2', name: 'Test Email Athlete', role: 'Athlete', isChannelAdmin: false },
  { id: 'u3', name: 'Daniel Athlete', role: 'Athlete', isChannelAdmin: false },
  { id: 'u4', name: 'Sarah Jones', role: 'Athlete', isChannelAdmin: false },
  { id: 'u5', name: 'Bhuvan Bhatt', role: 'Athlete', isChannelAdmin: false },
  { id: 'u6', name: 'Cathal Diver', role: 'Athlete', isChannelAdmin: false },
  { id: 'u7', name: 'Benny Gordon', role: 'Athlete', isChannelAdmin: false },
  { id: 'u8', name: 'Message Test Steve1', role: 'Athlete', isChannelAdmin: false },
  { id: 'u9', name: 'Android Tester', role: 'Athlete', isChannelAdmin: false },
  { id: 'u10', name: 'Chat Test', role: 'Athlete', isChannelAdmin: false },
  { id: 'u11', name: 'API Tester', role: 'Athlete', isChannelAdmin: false }
]

export const mockSquads = [
  { id: 's1', name: 'International Squad' },
  { id: 's2', name: 'Academy Squad' },
  { id: 's3', name: 'Entire Squad' },
  { id: 's4', name: 'Test' },
  { id: 's5', name: 'Technical Director' },
  { id: 's6', name: 'Player view' },
  { id: 's7', name: 'Test RPE Issue' },
  { id: 's8', name: 'team_1' },
  { id: 's9', name: 'team_2' },
  { id: 's10', name: '1st team' },
  { id: 's11', name: 'Academy team' },
  { id: 's12', name: 'rob test' }
]

export const mockPositions = [
  { id: 'pos1', name: 'Loose-head Prop', memberIds: ['u3', 'u5', 'u4', 'u8', 'u9'] },
  { id: 'pos2', name: 'Hooker', memberIds: ['current-user', 'u2', 'u6', 'u7', 'u10', 'u11'] },
  { id: 'pos3', name: 'Tight-head Prop', memberIds: [] }
]

// Direct messages (conversations between two users)
export const mockDirectMessages = [
  { id: 'dm1', type: 'dm', participantIds: ['current-user', 'u1'], name: 'cmgandroidtest241119-1 Android Test', lastActivity: '2025-02-19T03:04:00Z' },
  { id: 'dm2', type: 'dm', participantIds: ['current-user', 'u2'], name: 'Test Email Athlete', lastActivity: '2025-02-18T10:00:00Z' }
]

// Channels
export const mockChannels = [
  { id: 'ch1', type: 'channel', name: 'International Squad', description: 'International squad updates', memberIds: ['current-user', 'u1', 'u3', 'u4'], isPrivate: true, channelId: 'CHb2ca56accaee46b589f05c1757fc4d95', muted: true, athletesCanSend: false, staffCanSend: true }
]

// All conversations (DMs + channels) for sidebar
export const getAllConversations = () => [
  ...mockChannels,
  ...mockDirectMessages
].sort((a, b) => new Date(b.lastActivity || 0) - new Date(a.lastActivity || 0))

// Messages per conversation (mock)
export const mockMessagesByConversation = {
  dm1: [
    { id: 'm1', senderId: 'current-user', text: 'hello', timestamp: '2025-02-19T03:04:00Z', attachments: [] }
  ],
  dm2: [],
  ch1: []
}

export const getMessagesForConversation = (conversationId) => {
  return [...(mockMessagesByConversation[conversationId] || [])]
}

export const getUserById = (id) => mockUsers.find(u => u.id === id) || { id, name: 'Unknown', role: '' }

export const getChannelMembersWithRole = (channel) => {
  if (!channel?.memberIds) return []
  return channel.memberIds.map(id => {
    const u = getUserById(id)
    return { ...u, isChannelAdmin: id === currentUserId }
  })
}
