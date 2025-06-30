import { supabase } from "@/lib/supabase/products";
import { useState } from "react"

export const useSupabase=  ()=>{
    const [products,setProducts]=useState<any>([]);
    const [filterData,setFilterData]=useState<any>([]);
    const[filterId,setFilterId]=useState<any>([]);

    const getDataFromSupabase= async()=>{

        let{data,error}=await supabase.from('product').select("*")
        if(data){
            setProducts(data);
         
        }else{
            console.log(error)
        }
    }
    const getFilteredData= async(query:string)=>{

        let{data,error}=await supabase.from('product').select("*").or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        if(data){
            setFilterData(data);
            
        }else{
            console.log(error)
        }
    }


        const getProductById = async (id: number) => {
            const { data, error } = await supabase
              .from('product')
              .select('*')
              .eq('id', id)
              .single();
        
            if (data) {
              setFilterId(data);
            } else {
              console.error("ID fetch error:", error);
            }
          }
    
    return {products,
        getDataFromSupabase,
        getFilteredData,
        filterData,
        filterId,
        getProductById,
    }
}