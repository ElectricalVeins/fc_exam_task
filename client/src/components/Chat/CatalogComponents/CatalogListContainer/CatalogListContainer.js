import React from 'react';
import {connect} from 'react-redux';
import {getCatalogList, removeChatFromCatalog} from '../../../../actions/actionCreator';
import CatalogList from '../CatalogList/CatalogList';
import DialogList from '../../DialogComponents/DialogList/DialogList';


class CatalogListContainer extends React.Component {
    componentDidMount() {
        this.props.getCatalogList();
    }

    removeChatFromCatalog = (event, chatId) => {
        const {_id} = this.props.chatStore.currentCatalog;
        this.props.removeChatFromCatalog({chatId, catalogId: _id});
        event.stopPropagation();
    };

    getDialogsPreview = () => {
        const {messagesPreview, currentCatalog} = this.props.chatStore;
        const {chats} = currentCatalog;
        const dialogsInCatalog = [];
        messagesPreview.forEach(preview => {
            for (const chat of chats) {
                if (chat === preview._id) {
                    dialogsInCatalog.push(preview)
                }
            }
        })
        console.log('dialogsInCatalog',dialogsInCatalog)
        return dialogsInCatalog;
    };

    render() {
        const {catalogList, isShowChatsInCatalog} = this.props.chatStore;
        const {id} = this.props.userStore.data;
        return (
            <>
                {isShowChatsInCatalog ? <DialogList userId={id} preview={this.getDialogsPreview()}
                                                    removeChat={this.removeChatFromCatalog}/> :
                    <CatalogList catalogList={catalogList}/>}
            </>
        );
    }
}


const mapStateToProps = (state) => {
    const {chatStore, userStore} = state;
    return {chatStore, userStore};
};

const mapDispatchToProps = (dispatch) => {
    return {
        getCatalogList: () => dispatch(getCatalogList()),
        removeChatFromCatalog: (data) => dispatch(removeChatFromCatalog(data))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(CatalogListContainer);