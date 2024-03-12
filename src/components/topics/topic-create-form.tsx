'use client';

import { useFormState } from 'react-dom';
import {
    Input,
    Textarea,
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from '@nextui-org/react';
import * as actions from '@/actions';
import FormButton from '@/components/common/form-button';

export default function TopicCreateForm(){
const [formState, action] = useFormState(actions.CreateTopicPage, {
    errors: {},
});

    return(
        <Popover placement='left'>
            <PopoverTrigger>
                <Button color='primary'>Create a Topic</Button>
            </PopoverTrigger>
            <PopoverContent>
                <form action={action}>
                    <div className='flex flex-col gap-4 p-4 w-80'>
                        <h3 className="text-lg">Create  new topic</h3>
                        <Input name='name' label="Name" placeholder='Name' labelPlacement='outside' isInvalid={!!formState.errors.name} errorMessage={formState.errors.name?.join(', ')}/>
                        <Textarea name='description' label='Description' placeholder='Describe your topic' labelPlacement='outside' isInvalid={!!formState.errors.description} errorMessage={formState.errors.description?.join(', ')}/>
                        {
                            formState.errors._form ? <div className='p-2 bg-red-100 border rounded border-red-400'>{formState.errors._form?.join(', ')}</div> : null
                        }
                        <FormButton>Save</FormButton>
                    </div>
                </form>
            </PopoverContent>
        </Popover>
    );
}