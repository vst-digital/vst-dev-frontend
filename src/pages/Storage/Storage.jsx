import React from "react";
import FileManager, {
  Permissions,
  Toolbar,
  ContextMenu,
  Item,
  FileSelectionItem,
  ItemView,
  Details,
  Column
} from "devextreme-react/file-manager";
import { fileItems } from "./data.js";

class App extends React.Component {
  
  fileManagerAttributes = {
    id: 'elementId',
    class: 'class-name',
  }
  
  constructor(props) {
    super(props);
    this.fileManagerRef = React.createRef();
    this.onCurrentDirectoryChanged = this.onCurrentDirectoryChanged.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
    this.createFile = this.createFile.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.onOptionChanged = this.onOptionChanged.bind(this);
    
    this.newFileMenuOptions = {
      items: [
        {
          text: "Create New",
          icon: "plus",
          items: [
            {
              text: "Text Document",
              extension: ".txt"
            },
            {
              text: "Folder",
              extension: ""
            }
          ]
        }
      ],
      onItemClick: this.onItemClick.bind(this)
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
           
          ]
        }
      ],
      onItemClick: this.onItemClick.bind(this)
    };

     this.state = {
      itemViewMode: 'thumbnails',
    };

    
      this.onFileUploading = (e) => {
        const directory = this.fileManager.getCurrentDirectory()

        const newUpload = {
          __KEY__: Date.now(),
          name: `${e.fileData.name}`,
          isDirectory: false,      
          parent_id: `${directory.key}`,
          size: `${e.fileData.size}`,
           };
        console.log(newUpload)              //  upload data is stored here
            
        if (!directory.isDirectory) {return false;}

        // let array = null;
        //   array = fileItems;
          // array.push(newUpload);
          return true;
        };
  }

  createFile(
    fileExtension,
    directory = this.fileManager.getCurrentDirectory()) {

    const response = prompt("Folder Name")
    if(response === '')return;

    const newFile = {
      __KEY__: Date.now(),
      name: `${response}${fileExtension}`,
      isDirectory: false,      
      parent_id: `${directory.key}`,
      size: 0
    };

    console.log(newFile)              //  create new file data is stored here

    if (!directory.isDirectory) {return false;}

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
    directory = this.fileManager.getCurrentDirectory()
    
    ) {
    const response = prompt("Folder Name")
    if(response === '')return;

    const newFolder = {
      __KEY__: Date.now(),
      name: `${response}`,
      isDirectory: true,      
      parent_id: `${directory.key}`,

      size: 0
    };
    console.log(newFolder)              // new folder data is stored here

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

  onOptionChanged(e) {
   if (e.fullName === 'itemView.mode') {
     this.setState({
       itemViewMode: e.value,
       
      });
    }
    }

  onCurrentDirectoryChanged(e) {
      this.setState({
        currentPath: e.component.option('currentPath'),
        
      });
    }

  render() 
  {
        return (

      <FileManager
          ref={this.fileManagerRef}
          fileSystemProvider={fileItems}
          onContextMenuItemClick={this.onItemClick}
          onOptionChanged={this.onOptionChanged}
          customizeThumbnail={this.customizeIcon}
          onCurrentDirectoryChanged={this.onCurrentDirectoryChanged}
          elementAttr={this.fileManagerAttributes}
          onFileUploading={this.onFileUploading}
          height={450}
      >
        <Permissions
            // create={true}
            // copy={true}
            // move={true}
            // delete={true}
            // rename={true}
            upload={true}
            // download={true}
            // edit={true}
            >
        </Permissions>
        <ItemView showParentFolder={false}>
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
          <Item name="upload"/>
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
    );
  }

  get fileManager() {
    return this.fileManagerRef.current.instance;
  }

  onItemClick({ itemData, viewArea, fileSystemItem }) {
    let updated = false;
    if (itemData.extension) {
      updated = this.createFile(itemData.extension, fileSystemItem);
    }
    if (itemData.extension === "") {
      updated = this.createFolder(itemData.extension, fileSystemItem);
    }
     else if (itemData.category !== undefined) {
      updated = this.updateCategory(
        itemData.category,
        fileSystemItem,
        viewArea
      );
    }

    if (updated) {
      this.fileManager.refresh();
          // console.log(itemData)
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
      return 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/thumbnails/folder.svg';
    }

    const fileExtension = fileSystemItem.getFileExtension();
    switch (fileExtension) {
      case '.txt':
        return 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/thumbnails/doc-txt.svg';
      case '.pdf':
        return 'https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg';
      
      case '.xml':
        return 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/thumbnails/doc-xml.svg';
       case '.xlsx':
        return 'https://www.logo.wine/a/logo/Microsoft_Excel/Microsoft_Excel-Logo.wine.svg';
      default:
        return 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/thumbnails/doc-txt.svg';
    }
  }
}

export default App;
