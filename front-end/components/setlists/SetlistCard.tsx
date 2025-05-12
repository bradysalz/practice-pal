import { View, Text } from "react-native";
import { Edit, Trash2 } from "lucide-react-native";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Setlist } from '@/types/setlist';



interface Props {
    setlist: Setlist;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export const SetlistCard = ({ setlist, onEdit, onDelete }: Props) => {
    return (
        <View className="rounded-xl mb-3 overflow-hidden">
            <View className="border-1 border-slate-300">
                <Card className="rounded-xl">
                    <CardHeader className="flex-row justify-between items-center">
                        <View className="flex-1 min-w-0">
                            <Text className="font-bold text-xl">{setlist.name}</Text>
                            <Text className="text-md text-gray-700">{setlist.description}</Text>
                        </View>
                        <Badge variant="outline" className='flex-shrink-0 ml-2'>
                            <Text>
                                {setlist.items.length} items
                            </Text>
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <View className="mb-3 space-y-1">
                            {setlist.items.slice(0).map((item, index) => (
                                <Text key={index} className="text-gray-700 text-md">
                                    • {item.name}
                                    {item.type === "song" && item.artist ? ` - ${item.artist}` : ""}
                                </Text>
                            ))}
                            {setlist.items.length > 3 && (
                                <Text className="text-gray-700 text-md">• {setlist.items.length - 3} more...</Text>
                            )}
                        </View>
                        <View className="flex-row justify-between items-center">
                            <Text className="text-md text-gray-500">Last practiced: {setlist.lastPracticed}</Text>
                            <View className="flex-row space-x-2">
                                <Button variant="ghost" size="icon" onPress={() => onDelete(setlist.id)}>
                                    <Trash2 size={24} className="text-gray-500" />
                                </Button>
                                <Button variant="ghost" size="icon" onPress={() => onEdit(setlist.id)}>
                                    <Edit size={24} className="text-gray-500" />
                                </Button>
                            </View>
                        </View>
                    </CardContent>
                </Card>
            </View>
        </View>
    );
};
