
import { useState } from "react"
import { format } from "date-fns"
import { ChevronRight, Clock, Music, Dumbbell } from "lucide-react-native"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

type Exercise = {
    id: string
    name: string
    tempo: number
    duration: number
}

type Song = {
    id: string
    name: string
    artist?: string
    tempo: number
    duration: number
}

type PracticeSession = {
    id: string
    date: Date
    exercises: Exercise[]
    songs: Song[]
    totalDuration: number
}

interface PracticeSessionCardProps {
    session: PracticeSession
}

export function PracticeSessionCard({ session }: PracticeSessionCardProps) {
    const router = useRouter()
    const [isExpanded, setIsExpanded] = useState(false)

    const formattedDate = format(session.date, "EEEE, MMMM d")

    const handleCardClick = () => {
        if (!isExpanded) {
            setIsExpanded(true)
        } else {
            router.push(`/sessions/${session.id}`)
        }
    }

    return (
        <Card
            className={`overflow-hidden transition-all duration-300 border-l-4 ${isExpanded ? "border-l-red-500" : "border-l-slate-300"
                } hover:shadow-md`}
            onClick={handleCardClick}
        >
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-slate-100 border-b border-slate-200">
                <div>
                    <h3 className="font-bold text-lg">{formattedDate}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{session.totalDuration} mins</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className="flex items-center gap-1 bg-red-100 text-red-700 border-red-200 hover:bg-red-200">
                        <Dumbbell className="h-3 w-3 text-red-500" />
                        {session.exercises.length}
                    </Badge>
                    <Badge className="flex items-center gap-1 bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200">
                        <Music className="h-3 w-3 text-slate-500" />
                        {session.songs.length}
                    </Badge>
                    <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
                </div>
            </CardHeader>

            <CardContent
                className={`p-0 grid transition-all duration-300 ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
                <div className="overflow-hidden">
                    <div className="p-4 pt-2">
                        {session.exercises.length > 0 && (
                            <div className="mb-3">
                                <h4 className="text-sm font-semibold flex items-center gap-1 mb-2">
                                    <Dumbbell className="h-4 w-4 text-red-500" />
                                    Exercises
                                </h4>
                                <ul className="text-sm space-y-1">
                                    {session.exercises.map((exercise) => (
                                        <li key={exercise.id} className="flex justify-between">
                                            <span>{exercise.name}</span>
                                            <span className="text-muted-foreground">{exercise.tempo} BPM</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {session.songs.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold flex items-center gap-1 mb-2">
                                    <Music className="h-4 w-4 text-orange-500" />
                                    Songs
                                </h4>
                                <ul className="text-sm space-y-1">
                                    {session.songs.map((song) => (
                                        <li key={song.id} className="flex justify-between">
                                            <div>
                                                <span>{song.name}</span>
                                                {song.artist && <span className="text-muted-foreground text-xs"> - {song.artist}</span>}
                                            </div>
                                            <span className="text-muted-foreground">{song.tempo} BPM</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <Button
                            variant="default"
                            className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white"
                            onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/sessions/${session.id}`)
                            }}
                        >
                            View Full Session
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
