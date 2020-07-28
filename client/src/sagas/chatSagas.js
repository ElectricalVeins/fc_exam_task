import {put, select} from 'redux-saga/effects';
import ACTION from '../actions/actionTypes';
import * as restController from '../api/rest/restController';
import remove from 'lodash/remove';
import CONSTANTS from '../constants';


export function* previewSaga() {
    try {
        const {data} = yield  restController.getPreviewChat();
        data.sort((a,b)=> a.Messages[0].createdAt > b.Messages[0].createdAt ? -1 : 1)
        yield  put({type: ACTION.GET_PREVIEW_CHAT, data: data});
    } catch (err) {
        yield  put({type: ACTION.GET_PREVIEW_CHAT_ERROR, error: err.response});
    }
}


export function* getDialog(action) {
    try {
        const {data} = yield  restController.getDialog(action.id);
        yield put({type: ACTION.GET_DIALOG_MESSAGES, data: data});
    } catch (err) {
        yield put({type: ACTION.GET_DIALOG_MESSAGES_ERROR, error: err.response});
    }
}

export function* sendMessage(action) {
    try {
        const {data} = yield restController.newMessage(action.data);
        const {dialogsPreview} = yield select(state => state.chatStore);
        let isNew = true;
        dialogsPreview.forEach(preview => {
            if (preview.id === data.message.ConversationId) {
                preview.Messages[CONSTANTS.FIRST_ITEM] = data.message;
                isNew = false;
            }
        });
        if (isNew) {
            dialogsPreview.push(data.preview);
        }
        yield put({
            type: ACTION.SEND_MESSAGE,
            data: {
                message: data.message,
                dialogsPreview,
            }
        });
    } catch (err) {
        yield put({type: ACTION.SEND_MESSAGE_ERROR, error: err.response});
    }
}

export function* changeChatFavorite(action) {
    try {
        const {data} = yield restController.changeChatFavorite(action.data);
        const {dialogsPreview} = yield select(state => state.chatStore);
        dialogsPreview.forEach(preview => {
            if (preview.id === data.id)
                preview.favoriteList = data.isCreate;
        });
        yield put({type: ACTION.CHANGE_CHAT_FAVORITE, data: {dialogsPreview}});
    } catch (err) {
        yield put({type: ACTION.SET_CHAT_FAVORITE_ERROR, error: err.response});
    }
}

export function* changeChatBlock(action) {
    try {
        const {data} = yield restController.changeChatBlock(action.data);
        const {dialogsPreview} = yield select(state => state.chatStore);
        dialogsPreview.forEach(preview => {
            if (preview.id === data.id)
                preview.blackList = data.isCreate;
        });
        yield put({type: ACTION.CHANGE_CHAT_BLOCK, data: {dialogsPreview}});
    } catch (err) {
        yield put({type: ACTION.SET_CHAT_BLOCK_ERROR, error: err.response})
    }
}


export function* getCatalogListSaga(action) {
    try {
        const {data} = yield restController.getCatalogList();
        yield put({type: ACTION.RECEIVE_CATALOG_LIST, data: data});
    } catch (err) {
        yield put({type: ACTION.RECEIVE_CATALOG_LIST_ERROR, error: err.response});
    }
}

export function* addChatToCatalog(action) {
    try {
        const {data} = yield restController.addChatToCatalog(action.data);
        const {catalogList} = yield select(state => state.chatStore);
        for (let i = 0; i < catalogList.length; i++) {
            if (catalogList[i].id === data.id) {
                catalogList[i].chats = data.chats;
                break;
            }
        }
        yield put({type: ACTION.ADD_CHAT_TO_CATALOG, data: catalogList});
    } catch (err) {
        yield put({type: ACTION.ADD_CHAT_TO_CATALOG_ERROR, error: err.response});
    }
}


export function* createCatalog(action) {
    try {
        const {data} = yield restController.createCatalog(action.data);
        yield put({type: ACTION.CREATE_CATALOG_SUCCESS, data: data});
    } catch (err) {
        yield  put({type: ACTION.CREATE_CATALOG_ERROR, error: err.response});
    }
}

export function* deleteCatalog(action) {
    try {
        yield restController.deleteCatalog(action.data);
        const {catalogList} = yield select(state => state.chatStore);
        const newCatalogList = remove(catalogList, (catalog) => action.data !== catalog.id);
        yield put({type: ACTION.DELETE_CATALOG_SUCCESS, data: newCatalogList});
    } catch (err) {
        yield put({type: ACTION.DELETE_CATALOG_ERROR, error: err.response});
    }
}

export function* removeChatFromCatalogSaga(action) {
    try {
        const {data} = yield restController.removeChatFromCatalog(action.data);
        const {catalogList} = yield select(state => state.chatStore);
        catalogList.forEach(catalog=>{
            if(catalog.id === data.id){
                catalog.Conversations = data.Conversations;
            }
        })
        yield put({type: ACTION.REMOVE_CHAT_FROM_CATALOG_SUCCESS, data: {catalogList, currentCatalog: data}});
    } catch (err) {
        yield put({type: ACTION.REMOVE_CHAT_FROM_CATALOG_ERROR, error: err.response});
    }
}


export function* changeCatalogName(action) {
    try {
        const {data} = yield restController.changeCatalogName(action.data);
        const {catalogList} = yield select(state => state.chatStore);
        for(const catalog of catalogList) {
            if (catalog.id === data.id) {
                catalog.name = data.name;
                break;
            }
        }
        yield put({type: ACTION.CHANGE_CATALOG_NAME_SUCCESS, data: {catalogList, currentCatalog: data}});
    } catch (err) {
        yield put({type: ACTION.CHANGE_CATALOG_NAME_ERROR, error: err.response});
    }
}

export function* createChat(action) {
    try{
        const {data} = yield restController.createChat(action.data);
        yield put({type:ACTION.CREATE_DIALOG_SUCCESS, data});
    }catch (err) {
        yield put({type:ACTION.CREATE_DIALOG_ERROR, error: err.response});

    }
}
