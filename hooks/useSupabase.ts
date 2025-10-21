import { supabase } from "@/lib/supabase/products";
import { useState } from "react"

export const useSupabase=  ()=>{
    const [products,setProducts]=useState<any>([]);
    const [filterData,setFilterData]=useState<any>([]);
    const[filterId,setFilterId]=useState<any>(null);
    const [relatedProducts, setRelatedProducts] = useState<any>([]);

    const getDataFromSupabase= async()=>{

        let{data,error}=await supabase.from('product').select("id, title, price, images, category, description, created_at, rating, quantity, sizes")
        if(data){
            setProducts(data);
         
        }else{
            console.log(error)
        }
    }
    const getFilteredData= async(query:string)=>{

        let{data,error}=await supabase.from('product').select("id, title, price, images, category, description, created_at, rating, quantity, sizes").or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        if(data){
            setFilterData(data);
            
        }else{
            console.log(error)
        }
    }


        const getProductById = async (id: number) => {
            const { data, error } = await supabase
              .from('product')
              .select('id, title, price, images, category, description, created_at, rating, quantity, sizes')
              .eq('id', id)
              .single();
        
            if (data) {
              setFilterId(data);
            } else {
              console.error("ID fetch error:", error);
            }
          }

    const getRelatedProducts = async (currentProduct: any, limit: number = 4) => {
        if (!currentProduct) return;
        
        try {
            let related: any[] = [];

            // 1. First, get products with same category
            const { data: categoryProducts, error: categoryError } = await supabase
                .from('product')
                .select('id, title, price, images, category, description, created_at, rating, quantity, sizes')
                .eq('category', currentProduct.category)
                .neq('id', currentProduct.id)
                .limit(limit);

            if (!categoryError && categoryProducts) {
                related = [...categoryProducts];
            }

            // 2. If we need more products, try to find products with similar titles
            if (related.length < limit && currentProduct.title) {
                const titleWords = currentProduct.title.toLowerCase().split(' ').filter((word: string) => word.length > 3);
                
                if (titleWords.length > 0) {
                    const { data: titleProducts, error: titleError } = await supabase
                        .from('product')
                        .select('id, title, price, images, category, description, created_at, rating, quantity, sizes')
                        .neq('id', currentProduct.id)
                        .neq('category', currentProduct.category) // Avoid duplicates from category search
                        .or(titleWords.map((word: string) => `title.ilike.%${word}%`).join(','))
                        .limit(limit - related.length);

                    if (!titleError && titleProducts) {
                        const existingIds = related.map((p: any) => p.id);
                        const newProducts = titleProducts.filter((p: any) => !existingIds.includes(p.id));
                        related = [...related, ...newProducts];
                    }
                }
            }

            // 3. If we still need more products, get random products
            if (related.length < limit) {
                const { data: randomProducts, error: randomError } = await supabase
                    .from('product')
                    .select('id, title, price, images, category, description, created_at, rating, quantity, sizes')
                    .neq('id', currentProduct.id)
                    .limit(limit - related.length);

                if (!randomError && randomProducts) {
                    const existingIds = related.map((p: any) => p.id);
                    const newProducts = randomProducts.filter((p: any) => !existingIds.includes(p.id));
                    related = [...related, ...newProducts];
                }
            }

            setRelatedProducts(related.slice(0, limit));
        } catch (error) {
            console.error('Error fetching related products:', error);
        }
    };
    
    return {products,
        getDataFromSupabase,
        getFilteredData,
        filterData,
        filterId,
        getProductById,
        getRelatedProducts,
        relatedProducts,
    }
}