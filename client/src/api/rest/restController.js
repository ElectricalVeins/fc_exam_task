import http from '../interceptor';

export const registerRequest = data => http.post('registration', data);
export const loginRequest = data => http.post('login', data);

export const getUser = () => http.get('getUser');
export const updateUser = data => http.post('updateUser', data);

export const dataForContest = data => http.post('dataForContest', data);
export const updateContest = data => http.post('updateContest', data);
export const downloadContestFile = data =>
  http.get(`downloadFile/${data.fileName}`);
export const getCustomersContests = ({ limit, offset, contestStatus }) =>
  http.post(
    'getCustomersContests',
    { limit, offset },
    { headers: { status: contestStatus } }
  );
export const getActiveContests = filter => http.post('getAllContests', filter);
export const getContestById = ({ contestId }) =>
  http.get('getContestById', { headers: { contestId } });
export const payMent = data => http.post('pay', data.formData);
export const cashOut = data => http.post('cashout', data);
export const changeMark = data => http.post('changeMark', data);

export const setNewOffer = data => http.post('setNewOffer', data);
export const setOfferStatus = data => http.post('setOfferStatus', data);

export const createChat = data => http.post('createChat', data);
export const getPreviewChat = () => http.get('getPreview');
export const getDialog = id => http.get(`getChat?id=${id}`);
export const newMessage = data => http.post('newMessage', data);
export const changeChatFavorite = data => http.post('favorite', data);
export const changeChatBlock = data => http.post('blackList', data);
export const getCatalogList = () => http.get('getCatalogs');
export const addChatToCatalog = data => http.post('addNewChatToCatalog', data);
export const createCatalog = data => http.post('createCatalog', data);
export const deleteCatalog = data => http.delete(`deleteCatalog?id=${data}`);
export const removeChatFromCatalog = ({ chatId, catalogId }) =>
  http.delete(`removeChatFromCatalog?id=${chatId}&catalogId=${catalogId}`);
export const changeCatalogName = data => http.post('updateNameCatalog', data);

export const restorePasswordRequest = ({ data }) =>
  http.post('restorePassword', data);
export const updateLostPassword = ({ token }) =>
  http.post('updateLostPassword', token);

export const setOffer = data => http.post('moderator/setOffer', data);
export const getUnModeratedOffers = offset =>
  http.get(`moderator/getOffers?offset=${offset}`);

export const createTimer = data => http.post('createTimer', data);
export const getTimers = () => http.get('getTimers');
export const updateTimer = data => http.put('updateTimer', data);
export const deleteTimer = id => http.delete(`deleteTimer?id=${id}`);
