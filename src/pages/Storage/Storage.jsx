import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
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
import { useHttp } from "hooks";
import React, { useEffect, useState } from "react";

import { StorageFolder } from "shared/models";
import { getAllMembersList } from "shared/services";
import { getSelectDataSource } from "shared/utilities/common.util";
import { convertBlobToBase64 } from "../../helpers/FileHelpers";

const Storage = () => {
  const fileManagerAttributes = {
    id: "elementId",
    class: "class-name",
  };

  const [fileItemsOne, setFileItemsOne] = useState([]);
  const [userList, setUserList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = useState(undefined);
  const [parentFolder, setParentFolder] = useState("");
  const [itemViewMode, setItemViewMode] = useState("thumbnails");

  const { requestHandler } = useHttp();

  useEffect(() => {
    fetchFiles();

    getSelectDataSource(requestHandler, getAllMembersList())
      .then((res) => setUserList(res?.data))
      .catch((error) => console.error(error));
  }, []);

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
    // TODO: move all these configs to axios service
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

  // Common click event on file manager
  const onItemClick = ({ itemData }) => {
    if (itemData?.text === "Share") {
      handleClickOpen();
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

  // On selcting user from the user list
  const handleChange = (event) => {
    setSelectedUser(event?.target?.value || undefined);
  };

  // Open the user selction to share
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close the user selection
  const handleClose = (event, reason) => {
    if (reason !== "backdropClick") {
      setOpen(false);
    }
  };

  // Share the File with the selected user
  const shareFile = (e) => {
    e?.preventDefault();
    handleClose();

    // TODO: move all these configs to axios service
    try {
      axios.defaults.headers["Content-Type"] = "application/json";
      axios.defaults.headers["accept"] = "application/json";
      axios.defaults.headers["Authorization"] = localStorage.getItem("token");
      axios.defaults.headers["Project"] = localStorage.getItem("project_id");
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/user_storage_accesses`, {
          user_storage_access: {
            user_storage_id: localStorage.getItem("user_id"),
            shared_with_id: selectedUser,
          },
        })
        .then((res) => {
          const fileURL = res?.data?.url;
          window.open(fileURL, "_blank");
        })
        .catch((error) => console.error(error));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <FileManager
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

      {/* User Select Dialog */}
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Select user to share:</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel htmlFor="demo-dialog-native">User</InputLabel>
              <Select
                native
                value={selectedUser}
                onChange={handleChange}
                input={<OutlinedInput label="User" id="demo-dialog-native" />}
              >
                <option aria-label="None" value={undefined} />
                {userList?.map((user) => (
                  <option
                    key={user?.id}
                    value={user?.id}
                  >{`${user?.first_name} ${user?.last_name}`}</option>
                ))}
              </Select>
            </FormControl>

            {/* TODO: Enable user to select A complete user group to share the file */}
            {/* <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-dialog-select-label">User Group</InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={selectedUser}
                onChange={handleChange}
                input={<OutlinedInput label="Age" />}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl> */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={shareFile}>Ok</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Storage;
