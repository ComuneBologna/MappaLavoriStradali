CREATE TABLE [RoadWorks].[Attachments]
(
	[Id] BIGINT IDENTITY(1,1) NOT NULL,
	[WorkId] BIGINT NULL,
	[Name] NVARCHAR(256) NOT NULL,
	[IsPublic] BIT NULL,
	[ContentType] NVARCHAR(256) NOT NULL,
	[BlobStoragePath] NVARCHAR(256) NOT NULL,
	[LastUpdate] DATE NOT NULL,
	CONSTRAINT [PK_Attachments] PRIMARY KEY CLUSTERED ([Id] ASC),
	CONSTRAINT [FK_Attachments_Works] FOREIGN KEY ([WorkId]) REFERENCES [RoadWorks].[Works] ([Id])
)