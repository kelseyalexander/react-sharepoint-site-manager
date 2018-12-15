# SharePoint Site Manager
This application is written using ReactJS and compiled using WebpackJS. It was built using a collaborative boilerplate made for building ReactJS applications in SharePoint, which you can view [here](https://github.com/JMcAmmond/SharePoint-React-Boilerplate).

This application must be deployed to a SharePoint site where it can manage site content the user has access to.

- [Current Functionality](#current-functionality) 
    - [Manage Lists](#manage-lists)
        - [Create a List Manually](#create-a-list-manually)
        - [Copy another List](#copy-another-list)
        - [Create a List from Excel](#create-a-list-from-excel)
- [Future Functionality](#future-functionality)
    - [Home](#home)
    - [Manage Lists](#manage-lists)
        - [Edit a list](#edit-a-list)
    - [Manage Libraries](#manage-libraries)
    - [Manage Subsites](#manage-subsites)
    - [Manage Permissions](#manage-permissions)
- [License](#license)

## Current Functionality
### Manage Lists
#### Create a List Manually
A user can manage the following properties and create a new list with defined columns on any SharePoint site they have access to:

| Prop Name     | Description                                           |
|---------------|-------------------------------------------------------|
| URL           | URL of the site the list will be created for          |
| List Name     | Name of the new list                                  |
| Internal Name | True name of the column (referenced in REST requests) |
| Type          | Data type (Text, Note, Choice, etc.)                  |
| Display Name  | Name of the column in list settings and views         |
| Required      | Is the column required when editing items?            |
| Option 1      | Changes depending on the column type                  |
| Option 2      | Changes depending on the column type                  |
| Option 3      | Changes depending on the column type                  |

#### Copy another List
A user can copy a list in order to create a new list. They can also copy the data from the source list.

| Prop Name             | Description                                        |
|-----------------------|----------------------------------------------------|
| Source URL            | URL of the site where the source list resides      |
| Source List Name      | Name of the list to be copied                      |
| Destination URL       | URL of the site where the new list will be created |
| Destination List Name | Name of the new list                               |
| Copy Data             | Flag for whether or not to copy the source data    |

#### Create a List from Excel
A user can upload an excel sheet in a specified format to create a new list. A template sheet is provided to start from.

| Prop Name             | Description                                        |
|-----------------------|----------------------------------------------------|
| Destination URL       | URL of the site where the new list will be created |
| Destination List Name | Name of the new list                               |

## Future Functionality
### Home
The ability to enter a keyword and be directed to the part of the application with the needed functionality will be added in the future.

### Manage Lists
#### Edit a List
The ability to edit the columns of an existing list will be added in the future. This will allow users to change the Display Name, Type, Required flag, and option fields for columns in the list specified. They will also be able to delete or add new columns and turn versioning on or off for the list.

### Manage Libraries
The ability to manage library metadata in a similar way to managing lists will be added in the future.

### Manage Subsites
The ability to manage subsites will be added in the future with the following features:

- Creating new subsites
- Deleting existing subsites
- Changing the name
- Breaking permission inheritance
- Listing content

### Manage Permissions
The ability to manage permissions will be added in the future with the following features:

- Creating new groups
- Deleting existing groups
- Editing members
- Changing group permissions.

## License
MIT Licensed.