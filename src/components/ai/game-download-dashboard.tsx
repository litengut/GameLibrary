"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
  GamepadIcon,
  HardDrive,
  Pause,
  Play,
  RotateCcw,
  Trash2,
  Wifi,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileChunkTracker } from "@/components/ai/file-chunk-tracker";
import { GameLibraryOverview } from "@/components/ai/game-library-overview";
import { ProgressMonitor } from "@/components/ai/progress-monitor";
import { DownloadControls } from "@/components/ai/download-controls";

interface GameFile {
  id: string;
  name: string;
  size: string;
  sizeBytes: number;
  progress: number;
  status: "downloading" | "completed" | "paused" | "error" | "pending";
  speed?: string;
  timeRemaining?: string;
  downloadedBytes: number;
}

interface Game {
  id: string;
  title: string;
  totalSize: string;
  files: Array<GameFile>;
  overallProgress: number;
  status: "downloading" | "completed" | "paused" | "error";
  image: string;
  genre: string;
  releaseDate: string;
  lastPlayed?: string;
  playTime?: string;
  rating?: number;
  installPath?: string;
  version?: string;
}

export function GameDownloadDashboard() {
  const [games, setGames] = useState<Array<Game>>([
    {
      id: "1",
      title: "Cyberpunk 2077",
      totalSize: "70.2 GB",
      overallProgress: 65,
      status: "downloading",
      image: "/cyberpunk-game-cover.png",
      genre: "RPG",
      releaseDate: "2020",
      lastPlayed: "2024-01-15",
      playTime: "45.2 hours",
      rating: 4,
      installPath: "/games/cyberpunk2077",
      version: "2.1.0",
      files: [
        {
          id: "1-1",
          name: "cyberpunk_part1.bin",
          size: "5.0 GB",
          sizeBytes: 5368709120,
          progress: 100,
          status: "completed",
          downloadedBytes: 5368709120,
        },
        {
          id: "1-2",
          name: "cyberpunk_part2.bin",
          size: "5.0 GB",
          sizeBytes: 5368709120,
          progress: 100,
          status: "completed",
          downloadedBytes: 5368709120,
        },
        {
          id: "1-3",
          name: "cyberpunk_part3.bin",
          size: "5.0 GB",
          sizeBytes: 5368709120,
          progress: 100,
          status: "completed",
          downloadedBytes: 5368709120,
        },
        {
          id: "1-10",
          name: "cyberpunk_part10.bin",
          size: "5.0 GB",
          sizeBytes: 5368709120,
          progress: 45,
          status: "downloading",
          speed: "12.5 MB/s",
          timeRemaining: "4m 32s",
          downloadedBytes: 2415919104,
        },
        {
          id: "1-11",
          name: "cyberpunk_part11.bin",
          size: "5.0 GB",
          sizeBytes: 5368709120,
          progress: 0,
          status: "pending",
          downloadedBytes: 0,
        },
        {
          id: "1-12",
          name: "cyberpunk_part12.bin",
          size: "5.0 GB",
          sizeBytes: 5368709120,
          progress: 0,
          status: "error",
          downloadedBytes: 0,
        },
      ],
    },
    {
      id: "2",
      title: "The Witcher 3: Wild Hunt",
      totalSize: "50.0 GB",
      overallProgress: 100,
      status: "completed",
      image: "/witcher-3-inspired-cover.png",
      genre: "RPG",
      releaseDate: "2015",
      lastPlayed: "2024-01-10",
      playTime: "127.8 hours",
      rating: 5,
      installPath: "/games/witcher3",
      version: "4.04",
      files: [
        {
          id: "2-1",
          name: "witcher3_part1.bin",
          size: "5.0 GB",
          sizeBytes: 5368709120,
          progress: 100,
          status: "completed",
          downloadedBytes: 5368709120,
        },
        // ... more completed files
      ],
    },
    {
      id: "3",
      title: "Red Dead Redemption 2",
      totalSize: "120.0 GB",
      overallProgress: 25,
      status: "paused",
      image: "/red-dead-redemption-2-game-cover.jpg",
      genre: "Action",
      releaseDate: "2018",
      installPath: "/games/rdr2",
      version: "1.0.1436.31",
      files: [
        {
          id: "3-1",
          name: "rdr2_part1.bin",
          size: "5.0 GB",
          sizeBytes: 5368709120,
          progress: 100,
          status: "completed",
          downloadedBytes: 5368709120,
        },
        {
          id: "3-7",
          name: "rdr2_part7.bin",
          size: "5.0 GB",
          sizeBytes: 5368709120,
          progress: 0,
          status: "paused",
          downloadedBytes: 0,
        },
      ],
    },
  ]);

  const [activeTab, setActiveTab] = useState("downloads");

  const handleFileAction = (
    gameId: string,
    fileId: string,
    action: "pause" | "resume" | "retry" | "delete"
  ) => {
    setGames((prevGames) =>
      prevGames.map((game) => {
        if (game.id !== gameId) return game;

        return {
          ...game,
          files: game.files.map((file) => {
            if (file.id !== fileId) return file;

            switch (action) {
              case "pause":
                return { ...file, status: "paused" as const };
              case "resume":
                return { ...file, status: "downloading" as const };
              case "retry":
                return {
                  ...file,
                  status: "downloading" as const,
                  progress: 0,
                  downloadedBytes: 0,
                };
              case "delete":
                return {
                  ...file,
                  status: "pending" as const,
                  progress: 0,
                  downloadedBytes: 0,
                };
              default:
                return file;
            }
          }),
        };
      })
    );
  };

  const handleLaunchGame = (gameId: string) => {
    console.log(`Launching game: ${gameId}`);
    // In a real app, this would launch the game executable
  };

  const handleUninstallGame = (gameId: string) => {
    console.log(`Uninstalling game: ${gameId}`);
    // In a real app, this would remove the game files and update the state
    setGames((prevGames) => prevGames.filter((game) => game.id !== gameId));
  };

  const handleGameSettings = (gameId: string) => {
    console.log(`Opening settings for game: ${gameId}`);
    // In a real app, this would open game-specific settings
  };

  const handleGlobalAction = (action: "pauseAll" | "resumeAll" | "stopAll") => {
    setGames((prevGames) =>
      prevGames.map((game) => {
        if (game.status === "completed") return game;

        switch (action) {
          case "pauseAll":
            return { ...game, status: "paused" as const };
          case "resumeAll":
            return { ...game, status: "downloading" as const };
          case "stopAll":
            return {
              ...game,
              status: "paused" as const,
              files: game.files.map((file) => ({
                ...file,
                status: "pending" as const,
                progress: 0,
                downloadedBytes: 0,
              })),
            };
          default:
            return game;
        }
      })
    );
  };

  const handleBandwidthChange = (maxDownload: number, maxUpload: number) => {
    console.log(
      `Bandwidth limits set: ${maxDownload} MB/s down, ${maxUpload} MB/s up`
    );
    // In a real app, this would update the download manager's bandwidth settings
  };

  const handleSettingsChange = (settings: any) => {
    console.log("Settings updated:", settings);
    // In a real app, this would update the download manager's configuration
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "downloading":
        return <Download className="h-4 w-4 text-blue-500" />;
      case "paused":
        return <Pause className="h-4 w-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-500/20 text-green-400 border-green-500/30",
      downloading: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      paused: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      error: "bg-red-500/20 text-red-400 border-red-500/30",
      pending: "bg-muted/20 text-muted-foreground border-muted/30",
    };

    return (
      <Badge
        className={`${variants[status as keyof typeof variants]} capitalize`}
      >
        {status}
      </Badge>
    );
  };

  const completedGames = games.filter((game) => game.status === "completed");
  const activeDownloads = games.filter((game) => game.status !== "completed");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Game Download Manager
          </h1>

          <p className="text-muted-foreground">
            Manage your game downloads and library
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wifi className="h-4 w-4" />
            <span>Connected</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <HardDrive className="h-4 w-4" />
            <span>2.1 TB Free</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-muted-foreground">
                  Active Downloads
                </p>
                <p className="text-2xl font-bold text-card-foreground">
                  {activeDownloads.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <GamepadIcon className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-muted-foreground">Completed Games</p>
                <p className="text-2xl font-bold text-card-foreground">
                  {completedGames.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-muted-foreground">Total Size</p>
                <p className="text-2xl font-bold text-card-foreground">
                  240.2 GB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-muted-foreground">Download Speed</p>
                <p className="text-2xl font-bold text-card-foreground">
                  12.5 MB/s
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4 max-w-2xl bg-muted/50 backdrop-blur-sm">
          <TabsTrigger
            value="downloads"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Downloads
          </TabsTrigger>
          <TabsTrigger
            value="monitor"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Monitor
          </TabsTrigger>
          <TabsTrigger
            value="controls"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Controls
          </TabsTrigger>
          <TabsTrigger
            value="library"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Library
          </TabsTrigger>
        </TabsList>

        <TabsContent value="downloads" className="space-y-4">
          {activeDownloads.map((game) => (
            <div key={game.id} className="space-y-4">
              <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <img
                        src={game.image || "/placeholder.svg"}
                        alt={game.title}
                        className="w-20 h-28 object-cover rounded-md border border-border/50"
                      />
                      <div>
                        <CardTitle className="text-xl text-card-foreground">
                          {game.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {game.genre} • {game.releaseDate}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Total Size: {game.totalSize}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {getStatusIcon(game.status)}
                          {getStatusBadge(game.status)}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-border/50 bg-background/50 hover:bg-accent"
                      >
                        {game.status === "downloading" ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-border/50 bg-background/50 hover:bg-accent"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-border/50 bg-background/50 hover:bg-accent"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-card-foreground">
                        Overall Progress
                      </span>
                      <span className="text-card-foreground">
                        {game.overallProgress}%
                      </span>
                    </div>
                    <Progress value={game.overallProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <FileChunkTracker
                gameId={game.id}
                gameTitle={game.title}
                files={game.files}
                onFileAction={(fileId, action) =>
                  handleFileAction(game.id, fileId, action)
                }
              />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="monitor" className="space-y-4">
          <ProgressMonitor games={games} />
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <DownloadControls
            games={games}
            onGlobalAction={handleGlobalAction}
            onBandwidthChange={handleBandwidthChange}
            onSettingsChange={handleSettingsChange}
          />
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <GameLibraryOverview
            games={games}
            onLaunchGame={handleLaunchGame}
            onUninstallGame={handleUninstallGame}
            onGameSettings={handleGameSettings}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
