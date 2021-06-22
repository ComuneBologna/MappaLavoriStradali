﻿CREATE TABLE [Import].[Logs]
(
	[Id] BIGINT IDENTITY(1,1) NOT NULL,
	[CompanyId] BIGINT NOT NULL,
	[LogFilePath] NVARCHAR(512) NOT NULL,
	[LogFileName] NVARCHAR(256) NOT NULL,
	[MigrationDate] DATE NOT NULL,
	CONSTRAINT [PK_Logs] PRIMARY KEY CLUSTERED ([Id] ASC),
	CONSTRAINT [FK_Logs_Companies] FOREIGN KEY ([CompanyId]) REFERENCES [RoadWorks].[Companies] ([Id])
)