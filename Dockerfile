# Use the official .NET runtime image as the base
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5189
EXPOSE 7274
EXPOSE 443
EXPOSE 8080


# Use the official .NET SDK image for building the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Notes.Common/Notes.Common.csproj", "Notes.Common/"]
COPY ["Notes.Entities/Notes.Entities.csproj", "Notes.Entities/"]
COPY ["Notes.Repositories/Notes.Repositories.csproj", "Notes.Repositories/"]
COPY ["Notes.Services/Notes.Services.csproj", "Notes.Services/"]

RUN dotnet restore "Notes.Services/Notes.Services.csproj"
COPY . .
WORKDIR "/src/Notes.Services"
RUN dotnet build "Notes.Services.csproj" -c Release -o /app/build

# Publish the application
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Notes.Services.csproj" -c  Release -o /app/publish /p:UseAppHost=false

# Build the runtime image
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Notes.Services.dll"]
