-- CREATE TABLE Users (
--                        UserId UNIQUEIDENTIFIER PRIMARY KEY, -- Primary Key
--                        Username NVARCHAR(50) NOT NULL, -- Unique Username
--                        Email NVARCHAR(100) NOT NULL UNIQUE, -- Unique Email
--                        Password NVARCHAR(MAX) NOT NULL, -- Hashed Password
--                        Role TINYINT NOT NULL, -- Enum for Roles (Admin/User)
--                        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(), -- Account Creation Timestamp
--                        IsActive TINYINT NOT NULL DEFAULT 1, -- Is User Active (Soft Delete)
--                        LatestJwtToken NVARCHAR(MAX) NULL, -- (Optional) Store the latest JWT token
--                        ProfilePicture NVARCHAR(MAX) NULL -- Nullable Profile Picture
-- );
-- 
-- 
-- CREATE TABLE NotesTitles (
--                              NoteId UNIQUEIDENTIFIER PRIMARY KEY, -- Primary Key
--                              Title NVARCHAR(100) NOT NULL UNIQUE, -- Unique Title
--                              DateCreated DATETIME NOT NULL DEFAULT GETDATE(), -- Creation Date
--                              DateEdited DATETIME NOT NULL, -- Edit Date
--                              Tag NVARCHAR(50) NULL, -- Tag for categorization
--                              IsActive TINYINT NOT NULL DEFAULT 1, -- Is Note Active (Soft Delete)
--                              Favourite TINYINT NOT NULL DEFAULT 0 -- Is Note Marked as Favourite
-- );
-- 
-- 
-- 
-- CREATE TABLE Content (
--                          NoteId UNIQUEIDENTIFIER PRIMARY KEY, -- Primary Key and Foreign Key
--                          FormattedContent NVARCHAR(MAX) NOT NULL, -- Formatted Content (e.g., HTML/JSON)
--                          ContentType NVARCHAR(20) NOT NULL, -- Type of Content (e.g., HTML, JSON)
--                          CreatedAt DATETIME NOT NULL DEFAULT GETDATE(), -- Creation Timestamp
--                          UpdatedAt DATETIME NOT NULL DEFAULT GETDATE(), -- Update Timestamp
--                          CONSTRAINT FK_Content_NotesTitles FOREIGN KEY (NoteId) REFERENCES NotesTitles(NoteId) ON DELETE CASCADE
-- );
-- 
-- 
-- CREATE TABLE UserNotes (
--                            UserId UNIQUEIDENTIFIER NOT NULL, -- Foreign Key to User
--                            NoteId UNIQUEIDENTIFIER NOT NULL, -- Foreign Key to NotesTitle
--                            Role NVARCHAR(50) NOT NULL, -- Role in the Note (e.g., Owner, Editor, Viewer)
--                            AccessGrantedAt DATETIME NOT NULL DEFAULT GETDATE(), -- Timestamp when the user was added as a collaborator
--                            PRIMARY KEY (UserId, NoteId), -- Composite Primary Key
--                            CONSTRAINT FK_UserNotes_Users FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
--                            CONSTRAINT FK_UserNotes_NotesTitles FOREIGN KEY (NoteId) REFERENCES NotesTitles(NoteId) ON DELETE CASCADE
-- );



-- for email verification 

-- Enable ANSI NULLS and QUOTED IDENTIFIER
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- ========================================
-- 1. Create Users Table
-- ========================================
CREATE TABLE [dbo].[Users] (
    [UserId] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, -- Primary Key
    [Username] NVARCHAR(50) NOT NULL, -- Unique Username
    [Email] NVARCHAR(100) NOT NULL UNIQUE, -- Unique Email
    [Password] NVARCHAR(MAX) NOT NULL, -- Hashed Password
    [Role] TINYINT NOT NULL, -- Role as simple tinyint (e.g., 0 = Admin, 1 = User)
    [CreatedAt] DATETIME NOT NULL DEFAULT GETDATE(), -- Account Creation Timestamp
    [IsActive] TINYINT NOT NULL DEFAULT 1, -- Soft Delete: 1 = Active, 0 = Inactive
    [LatestJwtToken] NVARCHAR(MAX) NULL, -- JWT Token
    [JwtTokenIssuedAt] DATETIME NULL, -- JWT Issued Timestamp
    [ProfilePicture] NVARCHAR(255) NULL, -- Profile Picture URL

-- Email Verification
    [EmailConfirmed] TINYINT NOT NULL DEFAULT 0, -- 0 = Unconfirmed, 1 = Confirmed
    [EmailVerificationToken] NVARCHAR(255) NULL, -- Email verification token
    [TokenExpiration] DATETIME NULL, -- Expiration for email verification token

-- Two-Factor Authentication (2FA)
    [TwoFactorEnabled] TINYINT NOT NULL DEFAULT 0, -- 0 = Disabled, 1 = Enabled
    [LatestOtp] NVARCHAR(10) NULL, -- Latest OTP sent to the user
    [OtpExpiration] DATETIME NULL -- Expiration for the OTP
    );
GO

-- Add Index on Email for faster lookups
CREATE UNIQUE INDEX IX_Users_Email ON [dbo].[Users] ([Email]);
GO

-- ========================================
-- 2. Create ExternalLogins Table
-- ========================================
CREATE TABLE [dbo].[ExternalLogins] (
    [ExternalLoginId] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, -- Primary Key
    [UserId] UNIQUEIDENTIFIER NOT NULL, -- Foreign Key to Users table
    [Provider] NVARCHAR(50) NOT NULL, -- Login Provider (e.g., Google, Facebook)
    [ProviderKey] NVARCHAR(200) NOT NULL, -- Unique ID provided by the provider
    [CreatedAt] DATETIME NOT NULL DEFAULT GETDATE() -- Creation Timestamp
    );
GO

-- Add Foreign Key Constraint to Users Table
ALTER TABLE [dbo].[ExternalLogins]
    ADD CONSTRAINT FK_ExternalLogins_Users
    FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users]([UserId]) ON DELETE CASCADE;
GO

-- Add Index for Provider and ProviderKey
CREATE INDEX IX_ExternalLogins_ProviderKey
    ON [dbo].[ExternalLogins] ([Provider], [ProviderKey]);
GO

-- ========================================
-- 3. Create NotesTitles Table
-- ========================================
CREATE TABLE [dbo].[NotesTitles] (
    [NoteId] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, -- Primary Key
    [Title] NVARCHAR(100) NOT NULL, -- Note Title
    [DateCreated] DATETIME NOT NULL DEFAULT GETDATE(), -- Creation Date
    [DateEdited] DATETIME NOT NULL, -- Last Edited Date
    [Tag] NVARCHAR(50) NULL, -- Optional Tag
    [IsActive] TINYINT NOT NULL DEFAULT 1, -- 1 = Active, 0 = Inactive
    [Favourite] TINYINT NOT NULL DEFAULT 0, -- 0 = Not Favorite, 1 = Favorite
    [UserId] UNIQUEIDENTIFIER NULL -- Optional Foreign Key to Users Table
    );
GO

-- Add Foreign Key Constraint to Users Table
ALTER TABLE [dbo].[NotesTitles]
    ADD CONSTRAINT FK_NotesTitles_Users
    FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users]([UserId]) ON DELETE SET NULL;
GO

-- ========================================
-- 4. Create Content Table
-- ========================================
CREATE TABLE [dbo].[Content] (
    [NoteId] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY, -- Foreign Key to NotesTitles
    [FormattedContent] NVARCHAR(MAX) NOT NULL, -- Content body
    [ContentType] NVARCHAR(20) NOT NULL, -- Type of Content (e.g., Text, Markdown)
    [CreatedAt] DATETIME NOT NULL DEFAULT GETDATE(), -- Creation timestamp
    [UpdatedAt] DATETIME NOT NULL DEFAULT GETDATE() -- Last Updated timestamp
    );
GO

-- Add Foreign Key Constraint to NotesTitles Table
ALTER TABLE [dbo].[Content]
    ADD CONSTRAINT FK_Content_NotesTitles
    FOREIGN KEY ([NoteId]) REFERENCES [dbo].[NotesTitles]([NoteId]) ON DELETE CASCADE;
GO

-- ========================================
-- 5. Create UserNotes Table
-- ========================================
CREATE TABLE [dbo].[UserNotes] (
    [UserId] UNIQUEIDENTIFIER NOT NULL, -- Foreign Key to Users Table
    [NoteId] UNIQUEIDENTIFIER NOT NULL, -- Foreign Key to NotesTitles Table
    [AccessGrantedAt] DATETIME NOT NULL DEFAULT GETDATE(), -- Collaboration Timestamp
    [Role] NVARCHAR(50) NOT NULL, -- Role: Owner, Editor, Viewer
    [Status] TINYINT NOT NULL DEFAULT 1, -- 1 = Active, 0 = Inactive

    PRIMARY KEY ([UserId], [NoteId]) -- Composite Primary Key
    );
GO

-- Add Foreign Key Constraint to Users Table
ALTER TABLE [dbo].[UserNotes]
    ADD CONSTRAINT FK_UserNotes_Users
    FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users]([UserId]) ON DELETE CASCADE;
GO

-- Add Foreign Key Constraint to NotesTitles Table
ALTER TABLE [dbo].[UserNotes]
    ADD CONSTRAINT FK_UserNotes_NotesTitles
    FOREIGN KEY ([NoteId]) REFERENCES [dbo].[NotesTitles]([NoteId]) ON DELETE CASCADE;
GO