import { useEffect, useState } from "react";
import { QuizStatus} from "@/app/types/quizSubmission";
import { QuizSubmissionService } from "@/app/services/quizSubmissionService";
import { Button} from "../ui/button";
import {Lock, CheckCircle2, AlertCircle, Car} from "lucide-react";
import { useRouter } from "next/router";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
    quizId: string;
    studentId: string;
    courseId: string;
    lessonId: string;
}

export default function QuizStatusCheck({quizId, studentId, courseId, lessonId}: Props){
    const router = useRouter();
    const [status, setStatus] = useState<QuizStatus | null>(null);
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const checkStatus = async ()=> {
            try{
                const quizStatus = await QuizSubmissionService.getQuizzStatus(quizId, studentId);
                setStatus(quizStatus);

            }catch(error){
                console.error("Failed to check quiz status", error);

            }finally{
                setLoading(false)
            }
            
        };
        checkStatus();
    },[quizId, studentId])

    if(loading) return <div>Đang kiểm tra...</div>
    if(status?.status ==='locked'){
        return(
            <Card className="border-red-500">
                <CardContent className='p-6 text-center'>
                    <Lock className="h-12 w-12 text-red-500 mx-auto mb-4"></Lock>
                    <h3 className="text-xl font-bold mb-2">Bài kiểm tra đã bị khóa</h3>
                    <p className="text-gray-600 mb-4">Bạn đã hoàn thành bài kiểm tra này</p>
                    {status?.submission &&(
                        <Button
                        onClick={()=>
                            router.push(`/student/course/${courseId}/lesson/${lessonId}/quiz/${quizId}/result?submissionId=${status.submission?.submissionId}`)
                        }
                        >
                            Xem kết quả
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }
    if(status?.status === 'completed' && !status?.canTake){
        return(
            <Card className="border-blue-500">
                <CardContent className="p-6 text-center">
                    <CheckCircle2 className="h-12 w-12 text-blue-500 mx-auto mb-4"></CheckCircle2>
                    <h3 className="text-xl font-bold mb-2">Bạn đã hoàn thành bài kiểm tra</h3>
                    <p className="text-gray-600 mb-4">Điểm số: {status.submission?.score}</p>
                
                    {status.submission &&(
                        <Button 
                        onClick={()=>
                            router.push(
                                `/student/course/${courseId}/lesson/${lessonId}/quiz/${quizId}/result?submissionId=${status.submission?.submissionId}`
                            )
                        }
                        >
                            Xem kết quả chi tiết
                        </Button>
                    )}
                </CardContent>
            </Card>
        )
    }
    return null;
}