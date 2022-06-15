import axios from "axios";
import FileManager, {
  Column,
  ContextMenu,
  Details,
  FileSelectionItem,
  Item,
  ItemView,
  Permissions,
  Toolbar,
} from "devextreme-react/file-manager";
import React from "react";
import { StorageFolder } from "shared/models";
import { convertBlobToBase64 } from "../../helpers/FileHelpers";
class Storage extends React.Component {
  fileManagerAttributes = {
    id: "elementId",
    class: "class-name",
  };

  constructor(props) {
    super(props);
    this.state = {
      fileItemsOne: [],
      parentFolder: "",
    };
    this.fileManagerRef = React.createRef();
    this.onCurrentDirectoryChanged = this.onCurrentDirectoryChanged.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.onOptionChanged = this.onOptionChanged.bind(this);


    this.state = {
      itemViewMode: "thumbnails",
    };

    this.onFileUploaded = async (e) => {
      try {
        let parent_id = "";
        parent_id = e.parentDirectory.dataItem?.id
          ? e.parentDirectory.dataItem.id
          : this.state.parentFolder;
        parent_id = parent_id == undefined ? "" : parent_id;
        const filedata = await convertBlobToBase64(e.fileData);
        const newUpload = {
          __KEY__: Date.now(),
          name: `${e.fileData.name}`,
          isDirectory: false,
          parent_id: `${parent_id}`,
          size: `${e.fileData.size}`,
          data: `${filedata}`,
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
              id: parent_id,
            }
          )
          .then((res) => {
            this.setState({
              fileItemsOne: res?.data?.data?.map((item) => item.attributes),
            });
          })
          .catch((error) => console.error(error));
      } catch (e) {
        console.log(e);
      }
    };
    this.create = async (e) => {
      try {
        let parent_id = "";
        parent_id = e?.parentDirectory?.dataItem?.id
          ? e.parentDirectory.dataItem.id
          : this.state.parentFolder;
        parent_id = parent_id == undefined ? "" : parent_id;
        const newFolder = {
          __KEY__: Date.now(),
          name: `${e.name}`,
          isDirectory: true,
          parent_id: `${parent_id}`,
          size: 0,
        };
        const folder = new StorageFolder(newFolder);
        axios.defaults.headers["Content-Type"] = "application/json";
        axios.defaults.headers["accept"] = "application/javascript";
        axios.defaults.headers["Authorization"] = localStorage.getItem("token");
        axios.defaults.headers["Project"] = localStorage.getItem("project_id");
        axios
          .post(`${process.env.REACT_APP_API_BASE_URL}/user_storages`, {
            user_storage: folder,
          })
          .then((res) => {
            this.setState({
              fileItemsOne: res?.data?.data?.map((item) => item.attributes),
            });
          })
          .catch((error) => console.error(error));
      } catch (e) {
        console.log(e);
      }
    };

    this.share = (e) => {
      console.log(e)
      const userID = 4;
      const shareID = 1;
    try {
        axios.defaults.headers["Content-Type"] = "application/json";
        axios.defaults.headers["accept"] = "application/json";
        axios.defaults.headers["Authorization"] = localStorage.getItem("token");
        axios.defaults.headers["Project"] = localStorage.getItem("project_id");
        axios
          .post(
            `${process.env.REACT_APP_API_BASE_URL}/user_storage_accesses`,
            {
              "user_storage_id": userID,
              "shared_with_id": shareID
            }
          )
          .then((res) => {
            this.setState({
              fileItemsOne: res?.data?.data?.map((item) => item.attributes),
            });
          })
          .catch((error) => console.error(error));
      } catch (e) {
        console.log(e);
      }
    }
  }

  download = ({item, cancel}) => {
    const id = item?.dataItem?.id
    let temp = "FALSE"
    // TODO: move all these configs to axios service 
    try {
      axios.defaults.headers["Content-Type"] = "application/json";
      axios.defaults.headers["accept"] = "application/json";
      axios.defaults.headers["Authorization"] = localStorage.getItem("token");
      axios.defaults.headers["Project"] = localStorage.getItem("project_id");
      axios
      .get(
        `${process.env.REACT_APP_API_BASE_URL}/user_storages/${id}/generate_link`,
        // `${process.env.REACT_APP_API_BASE_URL}/user_storages/generate_link/${id}`,
        )
      .catch((error) => console.error(error));
        } catch (e) {
          console.log(e);
        }
    //cancel is used to stop the devexpress-filemanager from completing its own download
    // cancel(temp)                  
    }

  delete = ({item}) => {
    const id = item?.dataItem?.id
    // TODO: move all these configs to axios service 
    try {
       axios.defaults.headers["Content-Type"] = "application/json";
        axios.defaults.headers["accept"] = "application/json";
        axios.defaults.headers["Authorization"] = localStorage.getItem("token");
        axios.defaults.headers["Project"] = localStorage.getItem("project_id");
        axios
          .delete(
            `${process.env.REACT_APP_API_BASE_URL}/user_storages/${id}`,
          )
          .then((res) => {
            if (res?.statusText  === "OK") {
              this.fetchFiles()
            }
          })
          .catch((error) => console.error(error));
      } catch (e) {
        console.log(e);
      }
    }

  componentDidMount = () => {
    this.fetchFiles()
  };

  fetchFiles = () => {
    try {
      axios.defaults.headers["Content-Type"] = "application/json";
      axios.defaults.headers["accept"] = "application/javascript";
      axios.defaults.headers["Authorization"] = localStorage.getItem("token");
      axios.defaults.headers["Project"] = localStorage.getItem("project_id");
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/user_storages`, {})
        .then((res) => {
          this.setState({
            fileItemsOne: res?.data?.data?.map((item) => item.attributes),
          });
        })
        .catch((error) => console.error(error));
    } catch (e) {
      console.log(e);
    }
  }

  onOptionChanged(e) {
    if (e.fullName === "itemView.mode") {
      this.setState({
        itemViewMode: e.value,
      });
    }
  }

  onCurrentDirectoryChanged = async (e) => {
    this.setState({
      currentPath: e.component.option("currentPath"),
    });
    this.setState({
      parentFolder: e.directory.dataItem.id,
    });
    try {
      axios.defaults.headers["Content-Type"] = "application/json";
      axios.defaults.headers["accept"] = "application/javascript";
      axios.defaults.headers["Authorization"] = localStorage.getItem("token");
      axios.defaults.headers["Project"] = localStorage.getItem("project_id");
      axios
        .get(
          `${process.env.REACT_APP_API_BASE_URL}/user_storages/${e.directory.dataItem.id}`,
          {
            user_storage: {
              __KEY__: e.directory.dataItem.__KEY__,
              id: e.directory.dataItem.id,
            },
          }
        )
        .then((res) => {
          this.setState({
            fileItemsOne: res?.data?.data?.map((item) => item.attributes),
          });
        })
        .catch((error) => console.error(error));
    } catch (e) {
      console.log(e);
    }
  };

  get fileManager() {
    return this.fileManagerRef.current.instance;
  }

  onItemClick({ itemData, viewArea, fileSystemItem }) {
    let updated = false;
     if (itemData.text === "Share") {
      updated = this.share(fileSystemItem);
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
      if (item.dataItem) {
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
        onDirectoryCreated={this.create}         
        onItemDeleted={this.delete}
        onItemDownloading={this.download}
        height={450}
      >
        <Permissions
          create={true}
          delete={true}
          rename={true}
          download={true}
          upload={true}
        ></Permissions>

        {/* Columns to show */}
        <ItemView showParentFolder={false}>
          <Details>
            <Column dataField="thumbnail"></Column>
            <Column dataField="name"></Column>
            <Column dataField="category" caption="Category" width="95"></Column>
            <Column dataField="dateModified"></Column>
            <Column dataField="size"></Column>
          </Details>
        </ItemView>

        {/* Responsible for passing configs to context menu options */}
        <Toolbar>
          <Item name="showNavPane" visible="true" />
          <Item name="separator" />
          <Item name="create" />
          <Item name="upload" />
          <Item name="refresh" />
          <Item name="separator" location="after" />
          <Item name="switchView" />

          <FileSelectionItem name="rename" />
          <FileSelectionItem name="separator" />
          <FileSelectionItem name="delete" />
          <FileSelectionItem name="separator" />
          <FileSelectionItem name="upload" />
          <FileSelectionItem name="separator" />
          <FileSelectionItem name="download" />
          <FileSelectionItem name="separator" />
          <FileSelectionItem name="refresh" />
          <FileSelectionItem name="clearSelection" />
        </Toolbar>

        {/* Responsible for visual representation of context menu items like, order, sub items etc.  */}
        <ContextMenu>
          <Item name="create" />
          <Item text="Create new file" icon="plus">
            <Item text="Text Document" extension=".txt" />
            <Item text="RTF Document" extension=".rtf" />
            <Item text="Spreadsheet" extension=".xls" />
          </Item>
          <Item name="rename" beginGroup="true" />
          <Item name="upload" />
          <Item name="delete" />
          <Item text="Share" icon="share" beginGroup="true">
          </Item>
          <Item name="download" text="Download a File" />
          <Item name="refresh" />
        </ContextMenu>
      </FileManager>
    );
  }
}

export default Storage;
