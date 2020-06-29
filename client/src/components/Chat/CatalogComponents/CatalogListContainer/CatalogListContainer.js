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
        const {id} = this.props.chatStore.currentCatalog;
        this.props.removeChatFromCatalog({chatId, catalogId: id});
        event.stopPropagation();
    };

    getDialogsPreview = () => {
        const {dialogsPreview, currentCatalog:{Conversations}} = this.props.chatStore;
        const dialogsInCatalog = [];
        dialogsPreview.forEach(preview => {
            for (const chat of Conversations) {
                if (chat.id === preview.id) {
                    dialogsInCatalog.push(preview)
                }
            }
        })
        return dialogsInCatalog;
    };

    render() {
        const {catalogList, isShowChatsInCatalog} = this.props.chatStore;
        const {id} = this.props.userStore.data;
        return (
            <>
                {isShowChatsInCatalog ? <DialogList userId={id}
                                                    preview={this.getDialogsPreview()}
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
