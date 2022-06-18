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
import React, { useEffect, useState } from "react";
import { StorageFolder } from "shared/models";
import { convertBlobToBase64 } from "../../helpers/FileHelpers";

const Storage = () => {
  const fileManagerAttributes = {
    id: "elementId",
    class: "class-name",
  };

  const [fileItemsOne, setFileItemsOne] = useState([]);
  const [parentFolder, setParentFolder] = useState("");
  const [itemViewMode, setItemViewMode] = useState("thumbnails");

  const onFileUploaded = async (e) => {
    try {
      let parent_id = "";
      parent_id = e.parentDirectory.dataItem?.id
        ? e.parentDirectory.dataItem.id
        : parentFolder;
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
          setFileItemsOne(res?.data?.data?.map((item) => item.attributes));
        })
        .catch((error) => console.error(error));
    } catch (e) {
      console.log(e);
    }
  };

  const create = async (e) => {
    try {
      let parent_id = "";
      parent_id = e?.parentDirectory?.dataItem?.id
        ? e.parentDirectory.dataItem.id
        : parentFolder;

      parent_id = parent_id === undefined ? "" : parent_id;

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
        .post(`${process.env.REACT_APP_API_BASE_URL}/user_storages `, {
          user_storage: folder,
        })
        .then((res) => {
          setFileItemsOne(res?.data?.data?.map((item) => item.attributes));
        })
        .catch((error) => console.error(error));
    } catch (e) {
      console.log(e);
    }
  };

  const download = ({ item, cancel }) => {
    const fileID = item?.dataItem?.items[0]?.id; //not the id, but the object id

    let temp = "FALSE";
    // // TODO: move all these configs to axios service
    try {
      axios.defaults.headers["Content-Type"] = "application/json";
      axios.defaults.headers["accept"] = "application/json";
      axios.defaults.headers["Authorization"] = localStorage.getItem("token");
      axios.defaults.headers["Project"] = localStorage.getItem("project_id");
      axios
        .get(
          `${process.env.REACT_APP_API_BASE_URL}/user_storages/${fileID}/generate_link`
        )
        .then((res) => {
          const fileURL = res?.data?.url;
          window.open(fileURL, "_blank");
        })
        .catch((error) => console.error(error));
    } catch (e) {
      console.log(e);
    }
    cancel(temp); //cancel is used to stop the devexpress-filemanager from completing its own download
  };

  const deleteFile = ({ item }) => {
    const id = item?.dataItem?.items[0]?.id;
    // TODO: move all these configs to axios service
    try {
      axios.defaults.headers["Content-Type"] = "application/json";
      axios.defaults.headers["accept"] = "application/json";
      axios.defaults.headers["Authorization"] = localStorage.getItem("token");
      axios.defaults.headers["Project"] = localStorage.getItem("project_id");
      axios
        .delete(`${process.env.REACT_APP_API_BASE_URL}/user_storages/${id}`)
        .then((res) => {
          if (res?.statusText === "OK") {
            this.fetchFiles();
          }
        })
        .catch((error) => console.error(error));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = () => {
    try {
      axios.defaults.headers["Content-Type"] = "application/json";
      axios.defaults.headers["accept"] = "application/javascript";
      axios.defaults.headers["Authorization"] = localStorage.getItem("token");
      axios.defaults.headers["Project"] = localStorage.getItem("project_id");
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/user_storages`, {})
        .then((res) => {
          setFileItemsOne(res?.data?.data?.map((item) => item.attributes));
        })
        .catch((error) => console.error(error));
    } catch (e) {
      console.log(e);
    }
  };

  const onOptionChanged = (e) => {
    if (e.fullName === "itemView.mode") {
      setItemViewMode(e.value);
    }
  };

  const onItemClick = ({ itemData, fileSystemItem }) => {
    let updated = false;
    if (itemData.text === "Share") {
      updated = this.share(fileSystemItem);
    }
    if (updated) {
      this.fileManager.refresh();
    }
  };

  const customizeIcon = (fileSystemItem) => {
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
  };

  return (
    <>
      <FileManager
        // ref={this.fileManagerRef}
        fileSystemProvider={fileItemsOne}
        onContextMenuItemClick={onItemClick}
        onOptionChanged={onOptionChanged}
        customizeThumbnail={customizeIcon}
        elementAttr={fileManagerAttributes}
        onFileUploaded={onFileUploaded}
        onDirectoryCreated={create}
        onItemDeleted={deleteFile}
        onItemDownloading={download}
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
          <Item text="Share" icon="share" beginGroup="true"></Item>
          <Item name="download" text="Download a File" />
          <Item name="refresh" />
        </ContextMenu>
      </FileManager>
    </>
  );
};

export default Storage;
