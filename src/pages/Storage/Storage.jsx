import React from "react";
import { useState, useEffect, useHttp } from "react";
import FileManager, {
  Permissions,
  Toolbar,
  ContextMenu,
  Item,
  FileSelectionItem,
  ItemView,
  Details,
  Column,
  Upload,
} from "devextreme-react/file-manager";
import { fileItems } from "./data.js";
import { StorageFolder } from "shared/models";
import axios from "axios";
import {
  getUserStorages,
  postUserStorage,
  putUserStorage,
  deleteUserStorage,
} from "shared/services";
import { convertBlobToBase64 } from "../../helpers/FileHelpers";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileItemsOne: [],
      parentFolder: "",
    };
    this.fileManagerRef = React.createRef();
    this.onCurrentDirectoryChanged = this.onCurrentDirectoryChanged.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
    this.createFile = this.createFile.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.onOptionChanged = this.onOptionChanged.bind(this);
    this._onFolderCreate = this._onFolderCreate.bind(this);
    const storageFolder = new StorageFolder();

    this.newFileMenuOptions = {
      items: [
        {
          text: "Create New",
          icon: "plus",
          items: [
            {
              text: "Text Document",
              extension: ".txt",
            },
            {
              text: "Folder",
              extension: "",
            },
          ],
        },
      ],
      onItemClick: this.onItemClick.bind(this),
    };
    this.backButton = {
      items: [
        { 
          text: "Back",
          icon: "arrowleft",
        },
      ],
      onItemClick: this.onItemClick.bind(this),
    };

    this.share = {
      items: [
        {
          text: "Share",
          icon: "share",
          items: [
            {
              text: "Member",
            },
            {
              text: "Group",
            },
          ],
        },
      ],
      onShareClick: this.onShareClick.bind(this),
    };

    this.state = {
      itemViewMode: "thumbnails"
    };
    this.state = {
      navigation: "thumbnails"

    };
    

    this.onFileUploaded = async (e) => {
      try {
        let parent_id = ""
        parent_id = e.parentDirectory.dataItem?.id ? e.parentDirectory.dataItem.id : this.state.parentFolder
        parent_id = parent_id == undefined ? "" : parent_id;
        const filedata = await convertBlobToBase64(e?.fileData);
        const newUpload = {
          __KEY__: Date.now(),
          name: `${e.fileData.name}`,
          isDirectory: false,
          parent_id: `${parent_id}`,
          size: `${e.fileData.size}`,
          data: `${filedata}`
        };
        axios.defaults.headers["Content-Type"] = "application/json";
        axios.defaults.headers["accept"] = "application/json";
        axios.defaults.headers["Authorization"] = localStorage.getItem("token");
        axios.defaults.headers["Project"] = localStorage.getItem("project_id");
        axios
          .post(
            `${process.env.REACT_APP_API_BASE_URL}/user_storages/attach_file`,
            {
              user_storage: newUpload,
              id: parent_id
            }
          )
          .then((res) => {
            this.setState({
              fileItemsOne: res.data.data.map((item) => item?.attributes),
            });
          })
          .catch((error) => console.error(error));
      } catch (e) {
      }
    };

    this.onItemDeleted = async (e) => {
      try {
        const deletedItem = e.item.dataItem?.__KEY__
        axios.defaults.headers["Content-Type"] = "application/json";
        axios.defaults.headers["accept"] = "application/json";
        axios.defaults.headers["Authorization"] = localStorage.getItem("token");
        axios.defaults.headers["Project"] = localStorage.getItem("project_id");
        axios
          .delete(
            `${process.env.REACT_APP_API_BASE_URL}/user_storages/destroy`,
            {
               user_storage: deletedItem
            }
          )
          .then((res) => {
            this.setState({
              fileItemsOne: res.data.data.map((item) => item?.attributes),
            });
          })
          .catch((error) => console.error(error));
      } catch (e) {
      }
    };
  }
    onOptionChanged(e) {
        if (e?.fullName === "itemView.mode") {
          this.setState({
            itemViewMode: e?.value,
          });
        }
      }
  componentWillMount = () => {
    try {
      axios.defaults.headers["Content-Type"] = "application/json";
      axios.defaults.headers["accept"] = "application/javascript";
      axios.defaults.headers["Authorization"] = localStorage.getItem("token");
      axios.defaults.headers["Project"] = localStorage.getItem("project_id");
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/user_storages`, {})
        .then((res) => {
          this.setState({
            fileItemsOne: res.data.data.map((item) => item?.attributes),
          });
        })
        .catch((error) => console.error(error));
    } catch (e) {
    }
  };

  createFile(
    fileExtension,
    directory = this.fileManager.getCurrentDirectory()
  ) {
    const response = prompt("Folder Name");
    if (response === "") return;

    const newFile = {
      __KEY__: Date.now(),
      name: `${response}${fileExtension}`,
      isDirectory: false,
      parent_id: `${directory?.key}`,
      size: 0,
    };


    if (!directory.isDirectory) {
      return false;
    }

    let array = null;
    if (!directory.dataItem) {
      array = fileItems;
    } else {
      array = directory.dataItem.items;
      if (!array) {
        array = [];
        directory.dataItem.items = array;
      }
    }
    array.push(newFile);
    return true;
  }

  createFolder(
    fileExtension,
    directory = this.fileManager.getCurrentDirectory(),
    itemData,
  ) {
    const response = prompt("Folder Name");
    if (response === "") return;
    const newFolder = {
      __KEY__: Date.now(),
      name: `${response}`,
      isDirectory: true,
      parent_id: `${this.state.parentFolder == undefined ? "" : this.state.parentFolder}`, // TODO: IT is blank for some reason
      size: 0,
    };

    const storageFolder = new StorageFolder(newFolder);
    this._onFolderCreate(storageFolder);

    if (!directory.isDirectory) {
      return false;
    }

    let array = null;
    if (!directory.dataItem) {
      array = fileItems;
    } else {
      array = directory.dataItem.items;
      if (!array) {
        array = [];
        directory.dataItem.items = array;
      }
    }
    array.push(newFolder);
    return true;
  }


  

  onCurrentDirectoryChanged = async (e) => {
    const currentDirectory = e?.directory?.dataItem?.id
    this.setState({
      currentPath: e.component.option("currentPath"),
    });
    this.setState({
      parentFolder: e.directory.dataItem.id
    });
    try {
      axios.defaults.headers["Content-Type"] = "application/json";
      axios.defaults.headers["accept"] = "application/javascript";
      axios.defaults.headers["Authorization"] = localStorage.getItem("token");
      axios.defaults.headers["Project"] = localStorage.getItem("project_id");
      axios
        .get(
          `${process.env.REACT_APP_API_BASE_URL}/user_storages/${currentDirectory}`,
          {
            user_storage: {
              __KEY__: e.directory.dataItem.__KEY__,
              id: e.directory.dataItem.id,
            },
          }
        )
        .then((res) => {
          this.setState({
            fileItemsOne: res.data.data.map((item) => item?.attributes),
          });
        })
        .catch((error) => console.error(error));
    } catch (e) {
    }
  };
  
  backButtonClicked( currentDirectory
  ) {   
    return true;
  }

  onShareClick = (e) => {};

  _onFolderCreate = async (folder) => {
    if (folder) {
      try {
        axios.defaults.headers["Content-Type"] = "application/json";
        axios.defaults.headers["accept"] = "application/javascript";
        axios.defaults.headers["Authorization"] = localStorage.getItem("token");
        axios.defaults.headers["Project"] = localStorage.getItem("project_id");
        axios
          .post(`${process.env.REACT_APP_API_BASE_URL}/user_storages`, {
            user_storage: folder
          })
          .then((res) => {
            this.setState({
              fileItemsOne: res.data.data.map((item) => item?.attributes),
            });
          })
          .catch((error) => console.error(error));
      } catch (e) {
      }
    }
  };

  get fileManager() {
    return this.fileManagerRef.current.instance;
  }

  onItemClick({ itemData, viewArea, fileSystemItem }) {
    let updated = false;
    if (itemData?.extension) {
      updated = this.createFile(itemData.extension, fileSystemItem);
    }
    if (itemData?.extension === "") {
      updated = this.createFolder(itemData.extension, fileSystemItem, itemData);
    } 
    if (itemData?.text === "Share") {
  } 
    if (itemData?.text === "Back") {
    updated = this.backButtonClicked(this.onCurrentDirectoryChanged);
  } 
    else if (itemData?.category !== undefined) {
      updated = this.updateCategory(
        itemData.category,
        fileSystemItem,
        viewArea
      );
    }

    if (updated) {
      this.fileManager.refresh();
    }
  }

  updateCategory(newCategory, directory, viewArea) {
    let items = null;

    if (viewArea === "navPane") {
      items = [directory];
    } else {
      items = this.fileManager.getSelectedItems();
    }

    items.forEach((item) => {
      if (item?.dataItem) {
        item.dataItem.category = newCategory;
      }
    });

    return items.length > 0;
  }

  customizeIcon(fileSystemItem) {
    if (fileSystemItem.isDirectory) {
      return "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/thumbnails/folder.svg";
    }

    const fileExtension = fileSystemItem.getFileExtension();
    switch (fileExtension) {
      case ".txt":
        return "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/thumbnails/doc-txt.svg";
      case ".pdf":
        return "https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg";

      case ".xml":
        return "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/thumbnails/doc-xml.svg";
      case ".xlsx":
        return "https://www.logo.wine/a/logo/Microsoft_Excel/Microsoft_Excel-Logo.wine.svg";
      default:
        return "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/thumbnails/doc-txt.svg";
    }
  }

  render() {
    return (
      <>
        <FileManager
          ref={this.fileManagerRef}
          fileSystemProvider={this.state.fileItemsOne}
          onContextMenuItemClick={this.onItemClick}
          onOptionChanged={this.onOptionChanged}
          customizeThumbnail={this.customizeIcon}
          onCurrentDirectoryChanged={this.onCurrentDirectoryChanged}
          elementAttr={this.fileManagerAttributes}
          onFileUploading={this.onFileUploading}
          onFileUploaded={this.onFileUploaded}
          onItemDeleted={this.onItemDeleted}
          height={450}
        >
          <Upload chunkSize={500000} maxFileSize={1000000} />
          <Permissions
            // create={true}
            // copy={true}
            // move={true}
            delete={true}
            // rename={true}
            upload={true}
            // download={true}
            // edit={true}
          ></Permissions>
          <ItemView 
          // mode={this.state.itemViewMode}
          showParentFolder={true}>
            <Details>
              <Column dataField="thumbnail"></Column>
              <Column dataField="name"></Column>
              <Column dataField="dateModified"></Column>
              <Column dataField="size"></Column>
            </Details>
          </ItemView>
          <Toolbar>
            <Item name="showNavPane" visible="true" />
            <Item name="separator" />
            <Item
              widget="dxMenu"
              location="before"
              options={this.newFileMenuOptions}
            />
            <Item
              widget="dxMenu"
              location="before"
              options={this.backButton}
            />
            <Item name="upload" />
            <Item name="refresh" />
            <Item name="separator" location="after" />
            <Item name="switchView" />

            <FileSelectionItem name="rename" />
            <FileSelectionItem name="separator" />
            <FileSelectionItem name="copy" />
            <FileSelectionItem name="separator" />
            <FileSelectionItem name="move" />
            <FileSelectionItem name="separator" />
            <FileSelectionItem name="download" />
            <FileSelectionItem name="separator" />
            <FileSelectionItem
              widget="dxMenu"
              location="before"
              options={this.share}
            />
            <FileSelectionItem name="separator" />
            <FileSelectionItem name="delete" />
            <FileSelectionItem name="separator" />
            <FileSelectionItem name="clearSelection" />
          </Toolbar>
          <ContextMenu>
            <Item name="rename" beginGroup="true" />
            <Item name="copy" />
            <Item name="move" />
            <Item name="delete" />
            <Item text="Share" icon="share" beginGroup="true">
              <Item text="Member" />
              <Item text="Group" />
            </Item>
            <Item name="download" />
          </ContextMenu>
        </FileManager>
      </>
    );
  }
}

export default App;
