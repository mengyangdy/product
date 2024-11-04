import { useMainStore } from "@/store";
import { useRouter } from "vue-router";
import { deepClone } from "@dylanjs/utils";

export function useNav() {
  const router = useRouter();

  const store = useMainStore();

  return (path: any, query = {}, data?: any) => {
    if (data) {
      store.routeData = deepClone(data);
    }
    router.push({ path, query });
  };
}
