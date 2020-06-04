import React from 'react';
import {connect} from 'react-redux';
import CONSTANTS from '../../../../constants';
import {
    changeTypeOfChatAdding,
    changeShowAddChatToCatalogMenu,
    getCatalogList
} from '../../../../actions/actionCreator';
import styles from './CatalogCreation.module.sass';
import AddToCatalog from '../AddToCatalog/AddToCatalog';
import classNames from 'classnames';
import CreateCatalog from '../CreateCatalog/CreateCatalog';


class CatalogCreation extends React.Component {

    componentDidMount() {
        this.props.getCatalogList();
    }

    render() {
        const {changeTypeOfChatAdding, catalogCreationMode, changeShowAddChatToCatalogMenu, isFetching} = this.props;
        const addStyles = classNames({[styles.active]: catalogCreationMode === CONSTANTS.ADD_CHAT_TO_OLD_CATALOG});
        const creationStyles = classNames({[styles.active]: catalogCreationMode === CONSTANTS.CREATE_NEW_CATALOG_AND_ADD_CHAT});

        return (
            <>
                {
                    !isFetching &&
                    <div className={styles.catalogCreationContainer}>
                        <i className="far fa-times-circle" onClick={() => changeShowAddChatToCatalogMenu()}/>
                        <div className={styles.buttonsContainer}>
                            <span onClick={() => changeTypeOfChatAdding(CONSTANTS.ADD_CHAT_TO_OLD_CATALOG)}
                                  className={addStyles}>Old</span>
                            <span onClick={() => changeTypeOfChatAdding(CONSTANTS.CREATE_NEW_CATALOG_AND_ADD_CHAT)}
                                  className={creationStyles}>New</span>
                        </div>
                        {
                            catalogCreationMode === CONSTANTS.CREATE_NEW_CATALOG_AND_ADD_CHAT
                              ? <CreateCatalog/>
                              : <AddToCatalog/>
                        }
                    </div>
                }
            </>
        )
    }
}


const mapStateToProps = (state) => state.chatStore;


const mapDispatchToProps = (dispatch) => {
    return {
        changeTypeOfChatAdding: (data) => dispatch(changeTypeOfChatAdding(data)),
        changeShowAddChatToCatalogMenu: () => dispatch(changeShowAddChatToCatalogMenu()),
        getCatalogList: () => dispatch(getCatalogList())
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(CatalogCreation);