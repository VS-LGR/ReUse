import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';


const categories = [
  { name: 'Eletronicos', image: 'https://img.icons8.com/color/96/monitor--v1.png' },
  { name: 'Roupas', image: 'https://img.icons8.com/color/96/t-shirt.png' },
  { name: 'Casa e Construção', image: 'https://img.icons8.com/color/96/sofa.png' },
  { name: 'Brinquedos', image: 'https://img.icons8.com/color/96/lego.png' },
  { name: 'Papelaria', image: 'https://img.icons8.com/color/96/notebook.png' },
  { name: 'Sapatos', image: 'https://img.icons8.com/color/96/sneakers.png' },
];

const products = [
  { id: 1, name: 'Air pods', price: 60, image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/og-airpods-4-202409?wid=1200&hei=630&fmt=jpeg&qlt=95&.v=1724144134014', condition: 'USADO', rating: 6 },
  { id: 2, name: 'Cadeira', price: 90, image: 'https://www.cadeirasparaescritorio.ind.br/media/product/3de/cadeira-diretor-eames-office-base-cromada-dourada-courino-preto-cb3.webp', condition: 'USADO', rating: 4 },
  { id: 3, name: 'Blusa Adidas', price: 120, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHn1ogpl_oPQc6bKtmb_V5Wnn9K9v_pVYOiQ&s', condition: 'SEMI NOVA', rating: 9 },
  { id: 4, name: 'Blusa de Frio', price: 40, image: 'https://cdn.awsli.com.br/600x700/147/147820/produto/298237816/kit-0004-gnh09vxdzi.jpg', condition: 'USADO', rating: 7 },
  { id: 5, name: 'Patinhos de Borracha', price: 20, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnTo-oE3y_47zJ7NXPyKJ5JRciP3GCg7yrmA&s', condition: 'NOVO', rating: 10 },
  { id: 6, name: 'Mesa de Madeira', price: 150, image: 'https://images.tcdn.com.br/img/img_prod/894644/mesa_de_jantar_retangular_carlos_iii_em_madeira_de_demolicao_96_7_b1c2af593c8f25a76fe0b411cc6f97d8.jpg', condition: 'SEMI NOVA', rating: 8 },
  { id: 7, name: 'Peças de Brinquedo', price: 40, image: 'https://images.tcdn.com.br/img/img_prod/587775/blocos_de_montar_tubo_mania_50_pecas_brinquedo_educativo_1355_variacao_355_1_7b5fab2040fb1289066ee3f02d1f4501.png', condition: 'NOVO', rating: 10 },
  { id: 8, name: 'Tenis de Corrida', price: 85, image: 'https://i0.wp.com/www.perunning.com.br/wp-content/uploads/2023/08/mizuno-wave-rider-27-tenis-diario.jpg?fit=1000%2C562&ssl=1', condition: 'USADO', rating: 8 },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.topBar}>
        <Image source={{ uri: 'https://i.imgur.com/GYaQl3K.png' }} style={styles.logo} />
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Categorias</Text>
          <Ionicons name="chevron-down" size={16} />
        </TouchableOpacity>
        <View style={styles.rightIcons}>
          <Text style={styles.fontBtn}>aA</Text>
          <Ionicons name="notifications-outline" size={22} />
        </View>
      </View>

      {/* Location */}
      <TouchableOpacity style={styles.locationRow}>
        <Ionicons name="location-outline" size={20} />
        <Text style={styles.locationText}>São Paulo - Brasil</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Filtre por categoria e encontre o que precisa.</Text>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((cat, i) => (
          <View key={i} style={styles.categoryItem}>
            <Image source={{ uri: cat.image }} style={styles.categoryImage} />
            <Text style={styles.categoryLabel}>{cat.name}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Products */}
     {/* Products */}
<FlatList
  data={products}
  numColumns={2}
  keyExtractor={(item) => item.id.toString()}
  contentContainerStyle={styles.productList}
  renderItem={({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>R$ {item.price.toFixed(2)}</Text>
      <Text style={styles.productDetails}>
        {item.condition} — {item.rating}/10
      </Text>
    </TouchableOpacity>
  )}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 50,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  logo: { width: 100, height: 108 },
  dropdown: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  dropdownText: { fontWeight: '600', marginRight: 4 },
  rightIcons: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  fontBtn: {
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginTop: 4,
  },
  locationText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    margin: 16,
    marginBottom: 6,
  },
  categoryScroll: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  categoryLabel: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 60,
  },
  productList: {
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  productCard: {
    width: '47%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 6,
    padding: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 90,
    height: 90,
    marginBottom: 8,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 13,
    marginTop: 4,
    color: '#333',
  },
  productDetails: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
});
