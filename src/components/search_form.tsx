'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"; // Correct import path
import {useEffect} from "react"
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";
import { describe } from "node:test";

interface Desc {
  description: string,
  link: string,
  code: string,
}
// Define schema using zod
const FormSchema = z.object({
  describe: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function InputForm() {
  // Initialize form methods with react-hook-form

  const [desc, setDesc] = useState<Desc[] | null>(null);
  const [load, setLoading] = useState<boolean>(false);
  useEffect(() => {
    import('ldrs').then(mod => {
      mod.helix.register();
    // the then after this is to handle retrieving usernames for current users
    });
  },[]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      describe: "",
    },
  });

  // Handle form submission
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    const response = await fetch(`/api/search?question=${data.describe}`);
    const results:Desc[] = await response.json()
    setLoading(false);
    console.log(results);
    setDesc(results);
    
  }

  return (
  <div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="describe"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Netflixify</FormLabel>
              <FormControl>
                <Input placeholder="rom-com where the two lovers don't end up together" {...field} />
              </FormControl>
              <FormDescription>
                Describe what you want to watch, get very specific recommendations and links to netflix
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    { desc && !load && (
      desc.map((content, index) => (
        <a href={content.link} target="_blank" key={index}>
          <Card>
            <CardHeader>
              <CardTitle>{content.description}</CardTitle>
              <CardDescription>Netflix Search Code: {content.code}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Navigate to {content.link}</p>
            </CardContent>
          </Card>
          </a>
        ))
    )}
    { load && (
      <l-helix
        size="45"
        speed="2.5" 
        color="black" 
      ></l-helix>
    )}
    </div>
  );
}
