CREATE DATABASE MyDatabase;
GO

USE MyDatabase;

CREATE TABLE Users (
                       UserId UNIQUEIDENTIFIER PRIMARY KEY, -- Primary Key
                       Username NVARCHAR(50) NOT NULL, -- Unique Username
                       Email NVARCHAR(100) NOT NULL UNIQUE, -- Unique Email
                       Password NVARCHAR(MAX) NOT NULL, -- Hashed Password
                       Role TINYINT NOT NULL, -- Enum for Roles (Admin/User)
                       CreatedAt DATETIME NOT NULL DEFAULT GETDATE(), -- Account Creation Timestamp
                       IsActive TINYINT NOT NULL DEFAULT 1, -- Is User Active (Soft Delete)
                       LatestJwtToken NVARCHAR(MAX) NULL, -- (Optional) Store the latest JWT token
                       ProfilePicture NVARCHAR(MAX) NULL -- Nullable Profile Picture
);


CREATE TABLE NotesTitles (
                             NoteId UNIQUEIDENTIFIER PRIMARY KEY, -- Primary Key
                             Title NVARCHAR(100) NOT NULL UNIQUE, -- Unique Title
                             DateCreated DATETIME NOT NULL DEFAULT GETDATE(), -- Creation Date
                             DateEdited DATETIME NOT NULL, -- Edit Date
                             Tag NVARCHAR(50) NULL, -- Tag for categorization
                             IsActive TINYINT NOT NULL DEFAULT 1, -- Is Note Active (Soft Delete)
                             Favourite TINYINT NOT NULL DEFAULT 0 -- Is Note Marked as Favourite
);



CREATE TABLE Content (
                         NoteId UNIQUEIDENTIFIER PRIMARY KEY, -- Primary Key and Foreign Key
                         FormattedContent NVARCHAR(MAX) NOT NULL, -- Formatted Content (e.g., HTML/JSON)
                         ContentType NVARCHAR(20) NOT NULL, -- Type of Content (e.g., HTML, JSON)
                         CreatedAt DATETIME NOT NULL DEFAULT GETDATE(), -- Creation Timestamp
                         UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(), -- Update Timestamp
                         CONSTRAINT FK_Content_NotesTitles FOREIGN KEY (NoteId) REFERENCES NotesTitles(NoteId) ON DELETE CASCADE
);


CREATE TABLE UserNotes (
                           UserId UNIQUEIDENTIFIER NOT NULL, -- Foreign Key to User
                           NoteId UNIQUEIDENTIFIER NOT NULL, -- Foreign Key to NotesTitle
                           Role NVARCHAR(50) NOT NULL, -- Role in the Note (e.g., Owner, Editor, Viewer)
                           AccessGrantedAt DATETIME NOT NULL DEFAULT GETDATE(), -- Timestamp when the user was added as a collaborator
                           PRIMARY KEY (UserId, NoteId), -- Composite Primary Key
                           CONSTRAINT FK_UserNotes_Users FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
                           CONSTRAINT FK_UserNotes_NotesTitles FOREIGN KEY (NoteId) REFERENCES NotesTitles(NoteId) ON DELETE CASCADE
);
