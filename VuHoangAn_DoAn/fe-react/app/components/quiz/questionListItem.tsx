import React, { useState, useEffect } from 'react';
import { Question, Option } from '@/app/types/quiz';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2, PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface Props{
    question: Question;
    index: number;
    onUpdate: (question: Question) => void;
    onDelete: (questionId: string) => void;
}

const QuestionListItem: React.FC<Props> = ({question, index, onUpdate, onDelete}) => {
    const [text, setText] = useState(question.text);
    const [options, setOptions] = useState<Option[]>(question.options);
    const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer);

    useEffect(() => {
        setText(question.text);
        setOptions(question.options);
        setCorrectAnswer(question.correctAnswer);

    }, [question]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const newText = e.target.value;
        setText(newText);
        onUpdate({...question, text: newText, options, correctAnswer});
    };

    const handleOptionChange = (optionId: string, newtext: string)=>{
        const updatedOptions = options.map(opt=>
            opt.optionId === optionId ? {...opt, text: newtext}:opt
        );
        setOptions(updatedOptions);
        onUpdate({...question, text, options: updatedOptions, correctAnswer});
    };

    const handleAddOption = () => {
        const newOption: Option = {
            optionId: uuidv4(),
            text: `Lựa chọn ${options.length + 1}`
        }

        const updateOptions = [...options, newOption];
        setOptions(updateOptions);
        onUpdate({...question, text, options: updateOptions, correctAnswer});
    }

    const handleDeleteOption = (optionId: string) => {
        if(options.length <=2){
            alert("Phải có ít nhất 2 lựa chọn");
            return
        }
        const updatedOptions = options.filter(opt=>opt.optionId!= optionId);

        const newCorrectAnswer = correctAnswer === optionId ? '' : correctAnswer;
        setOptions(updatedOptions);
        setCorrectAnswer(newCorrectAnswer);
        onUpdate({...question, text, options: updatedOptions, correctAnswer: newCorrectAnswer});
    };

    const handleCorrecAnswerChange = (optionId: string) => {
        setCorrectAnswer(optionId);
        onUpdate({...question, text, options, correctAnswer: optionId});
    };

    return (
        <Card className='border-l-4 border-l-blue-500'>
            <CardContent className='p-4'>
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-2'>
                            <span className='font-semibold text-lg'>Câu {index + 1}</span>
                        </div>
                        <Input
                        value={text}
                        onChange={handleTextChange}
                        placeholder='Nhập nội dung câu hỏi'
                        className='text-base'
                        >
                        </Input>
                    </div>
                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={()=> onDelete(question.questionId)}
                    className="text-red-500 hover:text-red-700"
                    >
                        <Trash2 className="h-4 w-4"/>
                    </Button>
                </div>

                <div className='space-y-2 ml-4'>
                    <Label className="text-sm text-gray-600 mb-2 block">
                        Các lựa chọn (chọn đáp án đúng bằng radio button):
                    </Label>
                    {options.map((option, optionIndex)=>(
                        <div key={option.optionId} className='flex items-center gap-2'>
                            <input 
                            type="radio"
                            name={`correct-answer-${question.questionId}`}
                            checked={correctAnswer === option.optionId}
                            onChange={()=>handleCorrecAnswerChange(option.optionId)}
                            className='w-4 h-4' 
                            />

                            <Input
                            value={option.text}
                            onChange={(e)=>handleOptionChange(option.optionId, e.target.value)}
                            placeholder={`Lựa chọn ${optionIndex + 1}`}
                            >
                            </Input>

                            <Button 
                            variant='ghost'
                            size='icon'
                            onClick={()=>handleDeleteOption(option.optionId)}
                            disabled={options.length <= 2}
                            >
                                <Trash2 className='h-2 w-4'></Trash2>

                            </Button>

                        </div>
                        
                    ))}

                    <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddOption}
                    className='mt-2'
                    >
                        <PlusCircle className='h-4 w-4 mr-2' />
                        Thêm lựa chọn
                    </Button>
                </div>

            </CardContent>

        </Card>
    )

}

export default QuestionListItem;

