// app/product/[id].js

import { useLocalSearchParams, router } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const products = [
  {
    id: 1,
    name: 'Air pods',
    price: 60,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/og-airpods-4-202409?wid=1200&hei=630&fmt=jpeg&qlt=95&.v=1724144134014',
    condition: 'USADO',
    rating: 6,
    description: 'AirPods Apple original, pouco usados, funcionando perfeitamente.',
  },
  {
    id: 2,
    name: 'Cadeira',
    price: 90,
    image: 'https://www.cadeirasparaescritorio.ind.br/media/product/3de/cadeira-diretor-eames-office-base-cromada-dourada-courino-preto-cb3.webp',
    condition: 'USADO',
    rating: 4,
    description: 'Cadeira de escritório confortável com base cromada.',
  },
  {
    id: 3,
    name: 'Blusa Adidas',
    price: 120,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHn1ogpl_oPQc6bKtmb_V5Wnn9K9v_pVYOiQ&s',
    condition: 'SEMI NOVA',
    rating: 9,
    description: 'Blusa Adidas verde, muito conservada.',
  },
  {
    id: 4,
    name: 'Blusa de Frio',
    price: 40,
    image: 'https://cdn.awsli.com.br/600x700/147/147820/produto/298237816/kit-0004-gnh09vxdzi.jpg',
    condition: 'USADO',
    rating: 7,
    description: 'Blusa de frio masculina em bom estado.',
  },
  {
    id: 5,
    name: 'Patinhos de Borracha',
    price: 20,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnTo-oE3y_47zJ7NXPyKJ5JRciP3GCg7yrmA&s',
    condition: 'NOVO',
    rating: 10,
    description: 'Patinhos de borracha novos, ideal para crianças.',
  },
  {
    id: 6,
    name: 'Mesa de Madeira',
    price: 150,
    image: 'https://images.tcdn.com.br/img/img_prod/894644/mesa_de_jantar_retangular_carlos_iii_em_madeira_de_demolicao_96_7_b1c2af593c8f25a76fe0b411cc6f97d8.jpg',
    condition: 'SEMI NOVA',
    rating: 8,
    description: 'Mesa de madeira rústica, linda e firme.',
  },
  {
    id: 7,
    name: 'Peças de Brinquedo',
    price: 40,
    image: 'https://images.tcdn.com.br/img/img_prod/587775/blocos_de_montar_tubo_mania_50_pecas_brinquedo_educativo_1355_variacao_355_1_7b5fab2040fb1289066ee3f02d1f4501.png',
    condition: 'NOVO',
    rating: 10,
    description: 'Brinquedo novo com blocos numerados. Educativo e divertido.',
  },
  {
    id: 8,
    name: 'Tenis de Corrida',
    price: 85,
    image: 'https://i0.wp.com/www.perunning.com.br/wp-content/uploads/2023/08/mizuno-wave-rider-27-tenis-diario.jpg?fit=1000%2C562&ssl=1',
    condition: 'USADO',
    rating: 8,
    description: 'Tênis esportivo usado mas em ótimo estado.',
  },
];

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Produto não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Image source={{ uri: 'https://i.imgur.com/PBnxUoB.png' }} style={styles.logo} />
        <View style={styles.topIcons}>
          <Ionicons name="search-outline" size={22} />
          <Ionicons name="notifications-outline" size={22} />
        </View>
      </View>

      {/* Image */}
      <Image source={{ uri: product.image }} style={styles.image} />

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title}>{product.name}</Text>
        <View style={styles.row}>
          <Text style={styles.condition}>{product.condition}</Text>
        </View>
        <Text style={styles.price}>R$ {product.price.toFixed(2)}</Text>

        <Text style={styles.descTitle}>Descrição</Text>
        <Text style={styles.description}>{product.description}</Text>

        <Text style={styles.contact}>Interessado? Converse com o dono agora</Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Solicitar Troca</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingTop: 40,
  },
  logo: {
    width: 40,
    height: 40,
  },
  topIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  info: {
    padding: 16,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  condition: {
    color: '#777',
    marginTop: 2,
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  price: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  descTitle: {
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#444',
  },
  contact: {
    marginTop: 20,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});
