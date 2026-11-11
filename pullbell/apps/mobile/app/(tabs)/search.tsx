import { useCallback, useDeferredValue, useState } from "react";
import { FlatList, TextInput, View } from "react-native";
import { Loading, Message, ProductTile } from "@/components/ui";
import { api } from "@/lib/api";
import { useColors } from "@/lib/theme";
import { useData } from "@/lib/use-data";

export default function SearchScreen() {
  const c = useColors();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim());
  const load = useCallback(() => api.products(deferredQuery), [deferredQuery]);
  const products = useData(load);

  return (
    <FlatList
      data={products.data ?? []}
      numColumns={2}
      keyExtractor={(p) => p.slug}
      renderItem={({ item }) => <ProductTile product={item} />}
      columnWrapperStyle={{ gap: 14 }}
      contentContainerStyle={{ padding: 16, gap: 18 }}
      keyboardDismissMode="on-drag"
      ListHeaderComponent={
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Pokémon ETB, NeeDoh, Labubu…"
          placeholderTextColor={c.muted}
          autoCorrect={false}
          clearButtonMode="while-editing"
          style={{
            backgroundColor: c.card,
            borderColor: c.line,
            borderWidth: 1,
            borderRadius: 99,
            paddingHorizontal: 16,
            paddingVertical: 11,
            color: c.ink,
            fontSize: 16,
          }}
        />
      }
      ListEmptyComponent={products.data ? <Message>No products found.</Message> : <Loading error={products.error} />}
      ListFooterComponent={<View style={{ height: 16 }} />}
    />
  );
}
