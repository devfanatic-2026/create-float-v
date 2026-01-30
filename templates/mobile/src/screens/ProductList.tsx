import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { api } from '../services/api';
import { Product } from '../services/local-db';
import { navigationActions } from '../store/navigation';
import { useConnectionStore } from '../store/connection';
import { useState, useEffect } from 'react';
import { LiquidTokens, LiquidCard } from '@float-v/lite';

export default function ProductList() {
    const { goHome } = navigationActions;
    const { isOnline } = useConnectionStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await api.products.getAll();
            setProducts(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [isOnline]);

    const renderItem = ({ item }: { item: Product }) => (
        <LiquidCard variant="surface" style={styles.productCard}>
            <Image
                source={{ uri: item.image }}
                style={styles.productImage}
                resizeMode="cover"
            />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price}</Text>
                <Text style={styles.productDesc} numberOfLines={2}>
                    {item.description}
                </Text>
            </View>
        </LiquidCard>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={goHome} activeOpacity={0.7} style={styles.backButton}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Products</Text>
                <View style={styles.rightPlaceholder} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={LiquidTokens.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: LiquidTokens.colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: LiquidTokens.spacing.md,
        paddingVertical: LiquidTokens.spacing.md,
        backgroundColor: 'transparent',
    },
    backButton: {
        paddingVertical: 8,
    },
    backText: {
        color: LiquidTokens.colors.primary,
        fontSize: 17,
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: LiquidTokens.colors.textPrimary,
        letterSpacing: -0.4,
    },
    rightPlaceholder: {
        width: 60,
    },
    productCard: {
        flexDirection: 'row',
        marginBottom: LiquidTokens.spacing.md,
        padding: LiquidTokens.spacing.sm,
        height: 100,
        alignItems: 'center',
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: LiquidTokens.radii.md,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    productInfo: {
        flex: 1,
        marginLeft: LiquidTokens.spacing.md,
        justifyContent: 'center',
    },
    productName: {
        fontSize: 17,
        fontWeight: '600',
        color: LiquidTokens.colors.textPrimary,
        letterSpacing: -0.2,
    },
    productPrice: {
        fontSize: 15,
        fontWeight: '700',
        color: LiquidTokens.colors.primary,
        marginTop: 2,
    },
    productDesc: {
        fontSize: 13,
        color: LiquidTokens.colors.textSecondary,
        marginTop: 2,
        lineHeight: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: LiquidTokens.spacing.md,
        paddingTop: LiquidTokens.spacing.xs,
        paddingBottom: 40,
    }
});
