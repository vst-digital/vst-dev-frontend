import { setChonkyDefaults } from "chonky";
import { ChonkyIconFA } from "chonky-icon-fontawesome";
import {
  FileBrowser,
  FileNavbar,
  FileToolbar,
  FileList,
  FileContextMenu,
  ChonkyIconName,
  ChonkyActions,
  defineFileAction
} from "chonky";
import ExampleFolderData from "./ExampleFolderData";
// import Upload from "./Upload"
import axios from 'axios';
import React,{Component} from 'react';
// set chonky default
setChonkyDefaults({ iconComponent: ChonkyIconFA });
export class Upload extends Component { 

    state = { 
  
      // Initially, no file is selected 
      selectedFile: null
    }; 
     
    // On file select (from the pop up) 
    onFileChange = event => { 
      // Update the state 
      this.setState({ selectedFile: event.target.files[0]}); 
    }; 
     
    // On file upload (click the upload button) 
    onFileUpload = () => { 
      // Create an object of formData 
      const formData = new FormData(); 
     
      // Update the formData object 
      formData.append( 
        "myFile", 
        this.state.selectedFile, 
        this.state.selectedFile.name 
        
      ); 
     
      // Details of the uploaded file 
      console.log(this.state.selectedFile); 
     
      // Request made to the backend api 
      // Send formData object 
      axios.post("api/uploadfile", formData); 
    }; 
     
    // File content to be displayed after 
    // file upload is complete 
    fileData = () => { 
      if (this.state.selectedFile) { 
          
        return ( 
          <div> 
            <h2>File Details:</h2> 
            <p>File Name: {this.state.selectedFile.name}</p> 
            <p>File Type: {this.state.selectedFile.type}</p> 
            <p> 
              Last Modified:{" "} 
              {this.state.selectedFile.lastModifiedDate.toDateString()} 
            </p> 
          </div> 
        ); 
      } else { 
        return ( 
          <div> 
            <br /> 
            <h4>Upload Error</h4> 
          </div> 
        ); 
      } 
    }; 
     
    render() { 
      return ( 
        <div> 
            <div> 
                <input type="file" onChange={this.onFileChange} /> 
                <button onClick={this.onFileUpload}> 
                  Upload! 
                </button> 
            </div> 
          {this.fileData()} 
        </div> 
      ); 
    } 
  } ;
// dummy data
const { files, currentPath } = ExampleFolderData();
console.log(files, currentPath);

const handleAction = (data) => {
  if (data.id === createNewFolder.id) alert("Create Folder Action");
  if (data.id === editFiles.id) alert("Edit Folder Action");
  if (data.id === renameFiles.id) alert("Rename Folder Action");
  if (data.id === UploadFiles.id) alert("Upload File Action");
  if (data.id === ChonkyActions.DownloadFiles.id)
    alert("Download Folder Action");
  if (data.id === ChonkyActions.DeleteFiles.id) alert("Delete Folder Action");
  if (data.id === ChonkyActions.OpenFiles.id)
    alert("Fetch another file structure");
};
const createNewFolder = defineFileAction({
  id: "create_files",
  button: {
    name: "Create Folder",
    toolbar: true,
    contextMenu: true,
    icon: ChonkyIconName.folderCreate
  }
});

const editFiles = defineFileAction({
  id: "edit_files",
  button: {
    name: "Edit",
    toolbar: true,
    contextMenu: true,
    icon: ChonkyIconName.archive
  }
});
const UploadFiles = defineFileAction({
  id: "upload_files",
  button: {
    name: "Uload",
    toolbar: true,
    contextMenu: true,
    icon: ChonkyIconName.archive
  }
});

const renameFiles = defineFileAction({
  id: "rename_files",
  button: {
    name: "Rename",
    toolbar: true,
    contextMenu: true,
    icon: ChonkyIconName.code
  }
});

const myFileActions = [
  createNewFolder,
  editFiles,
  renameFiles,
  ChonkyActions.UploadFiles,
  ChonkyActions.DownloadFiles,
  ChonkyActions.DeleteFiles
];


const FileManager = () => {
  return (
    <div style={{ height: 700 }}>
      {/* <FullFileBrowser files={files} folderChain={folderChain} /> */}
      <FileBrowser
        files={files}
        folderChain={currentPath}
        fileActions={myFileActions}
        onFileAction={handleAction}
        defaultFileViewActionId={ChonkyActions.EnableListView.id}
        clearSelectionOnOutsideClick={true}
        disableDragAndDropProvider={false}
      >
        <FileNavbar />
        <FileToolbar />
        <FileList />
        <FileContextMenu />
      </FileBrowser>
      <Upload/>
    </div>
  );
};

export default FileManager;





