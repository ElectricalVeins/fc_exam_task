import isEqual from 'lodash/isEqual';

export const conversationInfo = (messagesPreview, participants) => {
  participants.sort((participant1, participant2) => participant1 - participant2);
  for (const msg of messagesPreview) {
    if (isEqual(participants, msg.participants)) {
      return {
        participants: msg.participants,
        _id: msg._id,
        blackList: msg.blackList,
        favoriteList: msg.favoriteList
      };
    }
  }
  return null;
};
