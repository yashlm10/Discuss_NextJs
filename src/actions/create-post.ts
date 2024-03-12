'use server';

import type {Post} from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import paths from '@/paths';
import {db} from '@/db';
import {z} from 'zod';
import {auth} from '@/auth';

const CreatePostSchema = z.object({ 
    title: z.string().min(3),
    content: z.string().min(10)
});

interface CreatePostFormState {
    errors: {
       title?: string[],
       content?: string[],
       _form?: string[]
    }
}

export async function CreatePostPage(slug: string, formState: CreatePostFormState, formData: FormData): Promise<CreatePostFormState>{
    const result = CreatePostSchema.safeParse({
        title: formData.get('title'),
        content: formData.get('content')
    });

    if(!result.success){
        return {
            errors: result.error.flatten().fieldErrors
        };
    };

    const session = await auth();
    if(!session || !session.user){
        return{
            errors: {
                _form: ['You must be signed in to do this']
            }
        }
    }

    const topic = await db.topic.findFirst({
        where: {slug}
    })
    if(!topic){
        return{
            errors: {
                _form: ['topic not found']
            }
        };
    }

   let post: Post;
   try {
     post = await db.post.create({
        data: {
           title: result.data.title,
           content: result.data.content,
           userId: session.user.id,
           topicId: topic.id
        }
     })
   } catch (err: unknown) {
       if(err instanceof Error){
         return {
            errors: {
                _form: [err.message]
            }
         };
       }else{
        return {
            errors: {
                _form: ['Failed to create post']
            }
         };
       }
   }

   revalidatePath(paths.topicShow(slug));
   redirect(paths.postShow(slug, post.id));

  
}