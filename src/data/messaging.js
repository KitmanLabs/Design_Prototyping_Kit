// Mock data for messaging – no backend
// All messaging mock data lives in src/data (see PROJECT_STANDARDS)
// Avatars: Pravatar (real-looking face photos, free, no API key). Same id = same image.
// Some users have no avatarUrl – UI falls back to initials.

const avatar = (id) => `https://i.pravatar.cc/200?u=${encodeURIComponent(id)}`

export const currentUserId = 'current-user'

export const mockUsers = [
  // No avatar – fallback to initials
  { id: 'current-user', name: 'Tymofii Antoniuk', role: 'Staff', isChannelAdmin: false },
  { id: 'u1', name: 'Marcus Johnson', role: 'Athlete', isChannelAdmin: false, avatarUrl: avatar('u1') },
  { id: 'u2', name: 'Elena Rodriguez', role: 'Athlete', isChannelAdmin: false, avatarUrl: avatar('u2') },
  // No avatar
  { id: 'u3', name: 'David Chen', role: 'Athlete', isChannelAdmin: false },
  { id: 'u4', name: 'Sarah Williams', role: 'Athlete', isChannelAdmin: false, avatarUrl: avatar('u4') },
  { id: 'u5', name: 'Alex Thompson', role: 'Athlete', isChannelAdmin: false, avatarUrl: avatar('u5') },
  // No avatar
  { id: 'u6', name: 'Emma Davis', role: 'Athlete', isChannelAdmin: false },
  { id: 'u7', name: 'James Wilson', role: 'Athlete', isChannelAdmin: false, avatarUrl: avatar('u7') },
  { id: 'u8', name: 'Maria Santos', role: 'Athlete', isChannelAdmin: false, avatarUrl: avatar('u8') },
  // No avatar
  { id: 'u9', name: "Liam O'Brien", role: 'Athlete', isChannelAdmin: false },
  { id: 'u10', name: 'Sophie Martin', role: 'Athlete', isChannelAdmin: false, avatarUrl: avatar('u10') },
  { id: 'u11', name: 'Noah Kim', role: 'Athlete', isChannelAdmin: false, avatarUrl: avatar('u11') },
  // No avatar
  { id: 'u12', name: 'Olivia Brown', role: 'Athlete', isChannelAdmin: false },
  { id: 'u13', name: 'Lucas Garcia', role: 'Athlete', isChannelAdmin: false, avatarUrl: avatar('u13') },
  { id: 'u14', name: 'Isabella Lee', role: 'Athlete', isChannelAdmin: false, avatarUrl: avatar('u14') },
  // No avatar
  { id: 'u15', name: 'Mason Taylor', role: 'Athlete', isChannelAdmin: false },
  { id: 'u16', name: 'Ava Anderson', role: 'Athlete', isChannelAdmin: false, avatarUrl: avatar('u16') },
  { id: 'u17', name: 'Ethan White', role: 'Athlete', isChannelAdmin: false, avatarUrl: avatar('u17') },
  // No avatar
  { id: 'u18', name: 'Mia Harris', role: 'Athlete', isChannelAdmin: false }
]

export const mockSquads = [
  { id: 's1', name: 'International Squad' },
  { id: 's2', name: 'Academy Squad' },
  { id: 's3', name: 'Entire Squad' },
  { id: 's4', name: 'First Team' },
  { id: 's5', name: 'Reserve Team' },
  { id: 's6', name: 'Technical Director' },
  { id: 's7', name: '1st team' },
  { id: 's8', name: 'Academy team' }
]

export const mockPositions = [
  { id: 'pos1', name: 'Loose-head Prop', memberIds: ['u3', 'u5', 'u4', 'u9'] },
  { id: 'pos2', name: 'Hooker', memberIds: ['current-user', 'u2', 'u6', 'u7', 'u10', 'u11'] },
  { id: 'pos3', name: 'Tight-head Prop', memberIds: ['u1', 'u8', 'u12'] }
]

// Direct messages – varied: unread from other, user ignored, active back-and-forth, different densities
export const mockDirectMessages = [
  // Unread from other person (Elena just replied)
  { id: 'dm1', type: 'dm', participantIds: ['current-user', 'u2'], name: 'Elena Rodriguez', lastActivity: '2025-02-24T09:15:00Z', unreadCount: 2, archived: false },
  // Active back-and-forth (Marcus)
  { id: 'dm2', type: 'dm', participantIds: ['current-user', 'u1'], name: 'Marcus Johnson', lastActivity: '2025-02-24T08:52:00Z', unreadCount: 0, archived: false },
  // Other person ignoring – last message from user, days ago
  { id: 'dm3', type: 'dm', participantIds: ['current-user', 'u3'], name: 'David Chen', lastActivity: '2025-02-18T14:00:00Z', unreadCount: 0, archived: true },
  // Sparse, formal
  { id: 'dm4', type: 'dm', participantIds: ['current-user', 'u4'], name: 'Sarah Williams', lastActivity: '2025-02-23T16:30:00Z', unreadCount: 1, archived: false },
  // Chatty thread
  { id: 'dm5', type: 'dm', participantIds: ['current-user', 'u5'], name: 'Alex Thompson', lastActivity: '2025-02-24T07:20:00Z', unreadCount: 0, archived: false },
  { id: 'dm6', type: 'dm', participantIds: ['current-user', 'u6'], name: 'Emma Davis', lastActivity: '2025-02-23T22:10:00Z', unreadCount: 0, archived: false },
  { id: 'dm7', type: 'dm', participantIds: ['current-user', 'u7'], name: 'James Wilson', lastActivity: '2025-02-22T11:00:00Z', unreadCount: 3, archived: false },
  { id: 'dm8', type: 'dm', participantIds: ['current-user', 'u8'], name: 'Maria Santos', lastActivity: '2025-02-21T09:45:00Z', unreadCount: 0, archived: true },
  { id: 'dm9', type: 'dm', participantIds: ['current-user', 'u9'], name: "Liam O'Brien", lastActivity: '2025-02-24T08:00:00Z', unreadCount: 0, archived: false },
  { id: 'dm10', type: 'dm', participantIds: ['current-user', 'u10'], name: 'Sophie Martin', lastActivity: '2025-02-20T17:20:00Z', unreadCount: 0, archived: true },
  { id: 'dm11', type: 'dm', participantIds: ['current-user', 'u11'], name: 'Noah Kim', lastActivity: '2025-02-23T12:05:00Z', unreadCount: 1, archived: false },
  { id: 'dm12', type: 'dm', participantIds: ['current-user', 'u12'], name: 'Olivia Brown', lastActivity: '2025-02-19T10:00:00Z', unreadCount: 0, archived: false },
  { id: 'dm13', type: 'dm', participantIds: ['current-user', 'u13'], name: 'Lucas Garcia', lastActivity: '2025-02-24T06:30:00Z', unreadCount: 0, archived: false },
  { id: 'dm14', type: 'dm', participantIds: ['current-user', 'u14'], name: 'Isabella Lee', lastActivity: '2025-02-23T19:00:00Z', unreadCount: 0, archived: false },
  { id: 'dm15', type: 'dm', participantIds: ['current-user', 'u15'], name: 'Mason Taylor', lastActivity: '2025-02-22T14:22:00Z', unreadCount: 0, archived: false },
  { id: 'dm16', type: 'dm', participantIds: ['current-user', 'u16'], name: 'Ava Anderson', lastActivity: '2025-02-21T08:15:00Z', unreadCount: 0, archived: false },
  { id: 'dm17', type: 'dm', participantIds: ['current-user', 'u17'], name: 'Ethan White', lastActivity: '2025-02-24T09:00:00Z', unreadCount: 0, archived: false },
  { id: 'dm18', type: 'dm', participantIds: ['current-user', 'u18'], name: 'Mia Harris', lastActivity: '2025-02-23T15:40:00Z', unreadCount: 0, archived: false }
]

// Channels – many more
export const mockChannels = [
  { id: 'ch1', type: 'channel', name: 'International Squad', description: 'International squad updates and announcements', memberIds: ['current-user', 'u1', 'u2', 'u3', 'u4'], isPrivate: true, channelId: 'CHb2ca56accaee46b589f05c1757fc4d95', muted: false, athletesCanSend: false, staffCanSend: true, lastActivity: '2025-02-24T09:00:00Z', unreadCount: 0, archived: false, inactiveMembers: [] },
  { id: 'ch2', type: 'channel', name: 'Academy Squad', description: 'Academy training and fixtures', memberIds: ['current-user', 'u5', 'u6', 'u7', 'u8', 'u9'], isPrivate: true, channelId: 'CHacademy01', muted: true, athletesCanSend: true, staffCanSend: true, lastActivity: '2025-02-24T08:30:00Z', unreadCount: 5, archived: false, inactiveMembers: ['u8', 'u9'] },
  { id: 'ch3', type: 'channel', name: 'First Team', description: 'First team only', memberIds: ['current-user', 'u1', 'u2', 'u4', 'u6', 'u7'], isPrivate: true, channelId: 'CHfirstteam01', muted: false, athletesCanSend: false, staffCanSend: true, lastActivity: '2025-02-23T18:20:00Z', unreadCount: 0, archived: false, inactiveMembers: [] },
  { id: 'ch4', type: 'channel', name: 'Injury & Recovery', description: 'RTP and medical updates', memberIds: ['current-user', 'u2', 'u3', 'u7'], isPrivate: true, channelId: 'CHinjury01', muted: false, athletesCanSend: true, staffCanSend: true, lastActivity: '2025-02-24T07:45:00Z', unreadCount: 1, archived: false, inactiveMembers: ['u3'] },
  { id: 'ch5', type: 'channel', name: 'Match Day', description: 'Match day logistics and lineup', memberIds: ['current-user', 'u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7'], isPrivate: false, channelId: 'CHmatchday01', muted: false, athletesCanSend: false, staffCanSend: true, lastActivity: '2025-02-22T14:00:00Z', unreadCount: 0, archived: true, inactiveMembers: [] },
  { id: 'ch6', type: 'channel', name: 'Strength & Conditioning', description: 'S&C programmes and check-ins', memberIds: ['current-user', 'u1', 'u4', 'u5', 'u8', 'u10'], isPrivate: true, channelId: 'CHsc01', muted: true, athletesCanSend: true, staffCanSend: true, lastActivity: '2025-02-23T12:00:00Z', unreadCount: 0, archived: false, inactiveMembers: [] },
  { id: 'ch7', type: 'channel', name: 'Travel & Logistics', description: 'Travel arrangements', memberIds: ['current-user', 'u1', 'u2', 'u3', 'u6', 'u9', 'u11'], isPrivate: true, channelId: 'CHtravel01', muted: false, athletesCanSend: false, staffCanSend: true, lastActivity: '2025-02-21T11:30:00Z', unreadCount: 0, archived: true, inactiveMembers: [] },
  { id: 'ch8', type: 'channel', name: 'Nutrition', description: 'Nutrition and hydration', memberIds: ['current-user', 'u4', 'u6', 'u8', 'u10', 'u12'], isPrivate: true, channelId: 'CHnutrition01', muted: false, athletesCanSend: true, staffCanSend: true, lastActivity: '2025-02-24T08:00:00Z', unreadCount: 2, archived: false, inactiveMembers: [] },
  { id: 'ch9', type: 'channel', name: 'Reserve Team', description: 'Reserve team chat', memberIds: ['current-user', 'u5', 'u8', 'u9', 'u13', 'u14'], isPrivate: true, channelId: 'CHreserve01', muted: false, athletesCanSend: true, staffCanSend: true, lastActivity: '2025-02-23T16:00:00Z', unreadCount: 0, archived: false, inactiveMembers: [] },
  { id: 'ch10', type: 'channel', name: 'Social & Events', description: 'Team socials and events', memberIds: ['current-user', 'u1', 'u2', 'u5', 'u6', 'u9', 'u10', 'u16', 'u18'], isPrivate: false, channelId: 'CHsocial01', muted: true, athletesCanSend: true, staffCanSend: true, lastActivity: '2025-02-20T19:00:00Z', unreadCount: 0, archived: false, inactiveMembers: [] }
]

// Messages per conversation – realistic, varied tone and density
export const mockMessagesByConversation = {
  dm1: [
    { id: 'm1', senderId: 'current-user', text: 'Hi Elena, how’s the knee feeling after yesterday’s session?', timestamp: '2025-02-24T08:50:00Z', attachments: [] },
    { id: 'm2', senderId: 'u2', text: 'A bit stiff in the morning but much better after the warm-up.', timestamp: '2025-02-24T08:52:00Z', attachments: [] },
    { id: 'm3', senderId: 'u2', text: 'Can I do the full pitch session today or should I stick to the modified plan?', timestamp: '2025-02-24T09:10:00Z', attachments: [] },
    { id: 'm4', senderId: 'u2', text: 'Also – did the physio report come through?', timestamp: '2025-02-24T09:15:00Z', attachments: [] }
  ],
  dm2: [
    { id: 'm5', senderId: 'u1', text: 'Morning – quick one about the video from Saturday.', timestamp: '2025-02-24T08:00:00Z', attachments: [] },
    { id: 'm6', senderId: 'current-user', text: 'Sure, what do you need?', timestamp: '2025-02-24T08:02:00Z', attachments: [] },
    { id: 'm7', senderId: 'u1', text: 'Can you send the clip of the second try? Want to show the kids.', timestamp: '2025-02-24T08:05:00Z', attachments: [] },
    { id: 'm8', senderId: 'current-user', text: 'I’ll grab it after the meeting and send it over.', timestamp: '2025-02-24T08:06:00Z', attachments: [] },
    { id: 'm9', senderId: 'u1', text: 'Cheers mate', timestamp: '2025-02-24T08:07:00Z', attachments: [] },
    { id: 'm10', senderId: 'current-user', text: 'No worries', timestamp: '2025-02-24T08:08:00Z', attachments: [] },
    { id: 'm11', senderId: 'u1', text: 'Actually one more thing – is the 3pm session still on?', timestamp: '2025-02-24T08:50:00Z', attachments: [] },
    { id: 'm12', senderId: 'current-user', text: 'Yes, 3pm as planned. See you there.', timestamp: '2025-02-24T08:52:00Z', attachments: [] }
  ],
  dm3: [
    { id: 'm13', senderId: 'current-user', text: 'David – when you get a chance can you confirm your availability for the 22nd?', timestamp: '2025-02-17T10:00:00Z', attachments: [] },
    { id: 'm14', senderId: 'current-user', text: 'Need to finalise the squad by Monday.', timestamp: '2025-02-17T10:01:00Z', attachments: [] },
    { id: 'm15', senderId: 'current-user', text: 'No rush, just when you can.', timestamp: '2025-02-18T14:00:00Z', attachments: [] }
  ],
  dm4: [
    { id: 'm16', senderId: 'current-user', text: 'Sarah – well done on Sunday. Clean sheet and really solid distribution.', timestamp: '2025-02-23T15:00:00Z', attachments: [] },
    { id: 'm17', senderId: 'u4', text: 'Thanks. Felt good. Will review the clips and get back to you if I have questions.', timestamp: '2025-02-23T16:30:00Z', attachments: [] }
  ],
  dm5: [
    { id: 'm18', senderId: 'u5', text: 'Hey!', timestamp: '2025-02-24T06:00:00Z', attachments: [] },
    { id: 'm19', senderId: 'current-user', text: 'Hey Alex, what’s up?', timestamp: '2025-02-24T06:05:00Z', attachments: [] },
    { id: 'm20', senderId: 'u5', text: 'Just checking – am I in the squad for Wednesday?', timestamp: '2025-02-24T06:06:00Z', attachments: [] },
    { id: 'm21', senderId: 'current-user', text: 'Yes, you’re in. I’ll send the full list later today.', timestamp: '2025-02-24T06:10:00Z', attachments: [] },
    { id: 'm22', senderId: 'u5', text: 'Perfect thanks', timestamp: '2025-02-24T06:11:00Z', attachments: [] },
    { id: 'm23', senderId: 'u5', text: 'Oh and can we do a quick 1-on-1 this week? Want to go through my positioning from the last game', timestamp: '2025-02-24T07:15:00Z', attachments: [] },
    { id: 'm24', senderId: 'current-user', text: 'Sure – Thursday 2pm work?', timestamp: '2025-02-24T07:18:00Z', attachments: [] },
    { id: 'm25', senderId: 'u5', text: 'Yeah that’s great, see you then', timestamp: '2025-02-24T07:20:00Z', attachments: [] }
  ],
  dm6: [
    { id: 'm26', senderId: 'u6', text: 'Hi – can I get the session plan for tomorrow?', timestamp: '2025-02-23T21:00:00Z', attachments: [] },
    { id: 'm27', senderId: 'current-user', text: 'It’s in the app under Training > This week. Same structure as last Tuesday.', timestamp: '2025-02-23T21:15:00Z', attachments: [] },
    { id: 'm28', senderId: 'u6', text: 'Got it, thanks', timestamp: '2025-02-23T22:10:00Z', attachments: [] }
  ],
  dm7: [
    { id: 'm29', senderId: 'u7', text: 'Hi – when you have a moment can we talk about the defensive shape from the weekend?', timestamp: '2025-02-22T09:00:00Z', attachments: [] },
    { id: 'm30', senderId: 'u7', text: 'I’ve got some ideas I’d like to run past you', timestamp: '2025-02-22T09:01:00Z', attachments: [] },
    { id: 'm31', senderId: 'u7', text: 'No rush – maybe after training one day this week?', timestamp: '2025-02-22T11:00:00Z', attachments: [] }
  ],
  dm8: [
    { id: 'm32', senderId: 'current-user', text: 'Maria – great energy in the session today. Keep it up.', timestamp: '2025-02-21T09:00:00Z', attachments: [] },
    { id: 'm33', senderId: 'u8', text: 'Thank you! Felt really good today', timestamp: '2025-02-21T09:45:00Z', attachments: [] }
  ],
  dm9: [
    { id: 'm34', senderId: 'u9', text: 'Bus leaving at 7:30 tomorrow right?', timestamp: '2025-02-24T07:50:00Z', attachments: [] },
    { id: 'm35', senderId: 'current-user', text: 'Yes, 7:30 from the main gate. Don’t be late 😄', timestamp: '2025-02-24T07:52:00Z', attachments: [] },
    { id: 'm36', senderId: 'u9', text: 'Wouldn’t dream of it', timestamp: '2025-02-24T08:00:00Z', attachments: [] }
  ],
  dm10: [
    { id: 'm37', senderId: 'current-user', text: 'Sophie – reminder to log your RPE after today’s session.', timestamp: '2025-02-20T16:00:00Z', attachments: [] },
    { id: 'm38', senderId: 'u10', text: 'Done 👍', timestamp: '2025-02-20T17:20:00Z', attachments: [] }
  ],
  dm11: [
    { id: 'm39', senderId: 'u11', text: 'Quick question – are we in the blue or white kit on Saturday?', timestamp: '2025-02-23T11:00:00Z', attachments: [] },
    { id: 'm40', senderId: 'current-user', text: 'Blue. I’ll put it in the match day channel too.', timestamp: '2025-02-23T11:30:00Z', attachments: [] },
    { id: 'm41', senderId: 'u11', text: 'Cheers', timestamp: '2025-02-23T12:05:00Z', attachments: [] }
  ],
  dm12: [
    { id: 'm42', senderId: 'current-user', text: 'Olivia – can you confirm your dietary requirements for the away trip?', timestamp: '2025-02-18T10:00:00Z', attachments: [] },
    { id: 'm43', senderId: 'u12', text: 'Vegetarian, no nuts. I’ll send the full list to the email you gave us.', timestamp: '2025-02-19T10:00:00Z', attachments: [] }
  ],
  dm13: [
    { id: 'm44', senderId: 'u13', text: 'Morning – is the gym open at 6am tomorrow?', timestamp: '2025-02-24T06:00:00Z', attachments: [] },
    { id: 'm45', senderId: 'current-user', text: 'Yes, 6–9am. Code is the same.', timestamp: '2025-02-24T06:30:00Z', attachments: [] }
  ],
  dm14: [
    { id: 'm46', senderId: 'current-user', text: 'Isabella – nice work on the set pieces in training. We’ll use that variation on Saturday.', timestamp: '2025-02-23T18:00:00Z', attachments: [] },
    { id: 'm47', senderId: 'u14', text: 'Thanks! Happy to run it again before the game if needed', timestamp: '2025-02-23T19:00:00Z', attachments: [] }
  ],
  dm15: [
    { id: 'm48', senderId: 'u15', text: 'Can I skip the warm-up tomorrow? Got a physio appointment at 8.', timestamp: '2025-02-22T14:00:00Z', attachments: [] },
    { id: 'm49', senderId: 'current-user', text: 'Yes, that’s fine. Join when you can.', timestamp: '2025-02-22T14:22:00Z', attachments: [] }
  ],
  dm16: [
    { id: 'm50', senderId: 'current-user', text: 'Ava – your assessment is scheduled for Tuesday 10am. Can you confirm?', timestamp: '2025-02-20T08:00:00Z', attachments: [] },
    { id: 'm51', senderId: 'u16', text: 'Confirmed, see you then', timestamp: '2025-02-21T08:15:00Z', attachments: [] }
  ],
  dm17: [
    { id: 'm52', senderId: 'u17', text: 'All set for the video review session?', timestamp: '2025-02-24T08:45:00Z', attachments: [] },
    { id: 'm53', senderId: 'current-user', text: 'Yes – 2pm in the usual room. I’ll have the clips ready.', timestamp: '2025-02-24T09:00:00Z', attachments: [] }
  ],
  dm18: [
    { id: 'm54', senderId: 'current-user', text: 'Mia – reminder that wellbeing forms are due by Friday.', timestamp: '2025-02-23T14:00:00Z', attachments: [] },
    { id: 'm55', senderId: 'u18', text: 'Will do it tonight, thanks for the nudge', timestamp: '2025-02-23T15:40:00Z', attachments: [] }
  ],
  ch1: [
    { id: 'ch1m1', senderId: 'current-user', text: 'Squad announcement for the 28th will go out tomorrow morning. Please check your emails.', timestamp: '2025-02-24T08:00:00Z', attachments: [] },
    { id: 'ch1m2', senderId: 'u1', text: '👍', timestamp: '2025-02-24T08:05:00Z', attachments: [] },
    { id: 'ch1m3', senderId: 'u2', text: 'Thanks', timestamp: '2025-02-24T08:10:00Z', attachments: [] }
  ],
  ch2: [
    { id: 'ch2m1', senderId: 'u5', text: 'Session at 4pm today still on?', timestamp: '2025-02-24T08:00:00Z', attachments: [] },
    { id: 'ch2m2', senderId: 'current-user', text: 'Yes – 4pm on pitch 2.', timestamp: '2025-02-24T08:15:00Z', attachments: [] },
    { id: 'ch2m3', senderId: 'u6', text: 'See you there', timestamp: '2025-02-24T08:20:00Z', attachments: [] },
    { id: 'ch2m4', senderId: 'u7', text: 'Bringing the cones?', timestamp: '2025-02-24T08:25:00Z', attachments: [] },
    { id: 'ch2m5', senderId: 'current-user', text: 'I’ll bring them. Just bring yourselves and boots.', timestamp: '2025-02-24T08:30:00Z', attachments: [] }
  ],
  ch3: [
    { id: 'ch3m1', senderId: 'current-user', text: 'Meeting at 1pm to go through the game plan. Conference room.', timestamp: '2025-02-23T18:00:00Z', attachments: [] },
    { id: 'ch3m2', senderId: 'u4', text: 'Will be there', timestamp: '2025-02-23T18:20:00Z', attachments: [] }
  ],
  ch4: [
    { id: 'ch4m1', senderId: 'u2', text: 'Physio said I can progress to full contact next week.', timestamp: '2025-02-24T07:30:00Z', attachments: [] },
    { id: 'ch4m2', senderId: 'current-user', text: 'Good to hear. We’ll phase you in gradually – I’ll adjust the plan.', timestamp: '2025-02-24T07:45:00Z', attachments: [] }
  ],
  ch5: [
    { id: 'ch5m1', senderId: 'current-user', text: 'Match day squad and travel details are in the doc. Please confirm receipt.', timestamp: '2025-02-22T13:00:00Z', attachments: [] },
    { id: 'ch5m2', senderId: 'u1', text: 'Got it', timestamp: '2025-02-22T14:00:00Z', attachments: [] }
  ],
  ch6: [
    { id: 'ch6m1', senderId: 'current-user', text: 'S&C programme for this block is updated. Check the app.', timestamp: '2025-02-23T11:00:00Z', attachments: [] },
    { id: 'ch6m2', senderId: 'u4', text: 'Done – looks good', timestamp: '2025-02-23T12:00:00Z', attachments: [] }
  ],
  ch7: [
    { id: 'ch7m1', senderId: 'current-user', text: 'Flight times for the away trip: dep 09:00, return 20:00. Buses from the ground at 06:30.', timestamp: '2025-02-21T10:00:00Z', attachments: [] },
    { id: 'ch7m2', senderId: 'current-user', text: 'Hotel details to follow.', timestamp: '2025-02-21T11:30:00Z', attachments: [] }
  ],
  ch8: [
    { id: 'ch8m1', senderId: 'u10', text: 'Reminder: hydration check-in is today. Log before 6pm.', timestamp: '2025-02-24T07:00:00Z', attachments: [] },
    { id: 'ch8m2', senderId: 'current-user', text: 'Thanks Sophie. Everyone please complete when you can.', timestamp: '2025-02-24T08:00:00Z', attachments: [] },
    { id: 'ch8m3', senderId: 'u12', text: 'Done', timestamp: '2025-02-24T08:15:00Z', attachments: [] },
    { id: 'ch8m4', senderId: 'u6', text: 'Done', timestamp: '2025-02-24T08:20:00Z', attachments: [] }
  ],
  ch9: [
    { id: 'ch9m1', senderId: 'u13', text: 'Anyone know if we’re training on the main pitch or the academy pitch tomorrow?', timestamp: '2025-02-23T15:00:00Z', attachments: [] },
    { id: 'ch9m2', senderId: 'current-user', text: 'Academy pitch. Main is being used for the first team.', timestamp: '2025-02-23T16:00:00Z', attachments: [] }
  ],
  ch10: [
    { id: 'ch10m1', senderId: 'u9', text: 'Team dinner next Friday – who’s in?', timestamp: '2025-02-20T18:00:00Z', attachments: [] },
    { id: 'ch10m2', senderId: 'u1', text: 'I’m in', timestamp: '2025-02-20T18:30:00Z', attachments: [] },
    { id: 'ch10m3', senderId: 'u10', text: 'Me too', timestamp: '2025-02-20T19:00:00Z', attachments: [] }
  ]
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

// All conversations (channels + DMs) for sidebar, sorted by last activity; includes unreadCount
export const getAllConversations = () => [
  ...mockChannels,
  ...mockDirectMessages
].sort((a, b) => new Date(b.lastActivity || 0) - new Date(a.lastActivity || 0))
