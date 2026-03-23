import {  View,  Text,  ScrollView,  Pressable,  Animated,  Image,  Modal,  TextInput,  Alert,  ActivityIndicator } from 'react-native'
import { useEffect, useState, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import styles from '../styles/screens/KnownScreenStyles'
import { API_BASE_URL } from '../config'

const API_BASE = API_BASE_URL
const CLOUD_NAME = "diq0bcrjl"
const UPLOAD_PRESET = "Test_Preset"


// ---------- Animated Person Card ----------
const AnimatedPersonCard = ({ person, index, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current
  const slideAnim = useRef(new Animated.Value(20)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 100,
      useNativeDriver: true
    }).start()

    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 7,
      delay: index * 100,
      useNativeDriver: true
    }).start()
  }, [index])

  const primaryImage = person.images?.[0]

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
      }}
    >
      <Pressable style={styles.card} onPress={() => onPress(person)}>
        {primaryImage ? (
          <Image source={{ uri: primaryImage }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>{person.name.charAt(0)}</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.name}>{person.name}</Text>
          <Text style={styles.relation}>{person.relation}</Text>
        </View>
      </Pressable>
    </Animated.View>
  )
}


// ---------- Screen ----------
export default function KnownScreen() {

  const [people, setPeople] = useState([])
  const [isModalVisible, setModalVisible] = useState(false)
  const [editingPersonId, setEditingPersonId] = useState(null)
  const [tempImages, setTempImages] = useState([])
  const [newName, setNewName] = useState("")
  const [newRelation, setNewRelation] = useState("")
  const [isUploading, setIsUploading] = useState(false)


  // ---------- Load faces from backend ----------
  useEffect(() => {
    fetchFaces()
  }, [])

  const fetchFaces = async () => {
    try {
      const res = await fetch(`${API_BASE}/faces`)
      const data = await res.json()

      setPeople(
        data.map(face => ({
          id: face.id.toString(),
          name: face.person_name,
          relation: face.relationship,
          images: [face.image_url]
        }))
      )
    } catch (err) {
      console.log("Fetch faces error:", err)
    }
  }


  // ---------- Image Picker ----------
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8
    })

    if (!result.canceled) {
      const uris = result.assets.map(a => a.uri)
      setTempImages(prev => [...prev, ...uris])
    }
  }


  // ---------- Cloudinary Upload ----------
  const uploadToCloudinary = async (uri) => {
    const formData = new FormData()

    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: "upload.jpg"
    })

    formData.append("upload_preset", UPLOAD_PRESET)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    )

    const json = await res.json()
    if (!json.secure_url) throw new Error("Cloudinary upload failed")

    return json.secure_url
  }


  // ---------- Save Person ----------
  // ---------- Save Person ----------
  const savePerson = async () => {
    if (!newName || !newRelation || tempImages.length === 0) {
      Alert.alert("Please fill all fields and add a photo");
      return;
    }

    setIsUploading(true);

    try {
      let imageUrl = tempImages[0];

      // Only upload to Cloudinary if it's a NEW local image (doesn't start with http)
      if (!imageUrl.startsWith("http")) {
        imageUrl = await uploadToCloudinary(imageUrl);
      }

      const payload = {
        person_name: newName,
        relationship: newRelation,
        image_url: imageUrl
      };

      let res;

      if (editingPersonId) {
        // UPDATE EXISTING ENTRY
        res = await fetch(`${API_BASE}/faces/${editingPersonId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        // CREATE NEW ENTRY
        res = await fetch(`${API_BASE}/faces`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        throw new Error("Server responded with an error");
      }

      await fetchFaces(); // Refresh list
      closeModal(); // Close and reset

    } catch (err) {
      console.log(err);
      Alert.alert("Upload failed", "Could not save person data.");
    } finally {
      setIsUploading(false);
    }
  };


  // ---------- Delete ----------
  const confirmDeletePerson = () => {
    if (!editingPersonId) return

    Alert.alert("Delete Person", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await fetch(`${API_BASE}/faces/${editingPersonId}`, {
              method: "DELETE"
            })
            await fetchFaces()
            closeModal()
          } catch (err) {
            console.log(err)
          }
        }
      }
    ])
  }


  // ---------- Modal Helpers ----------
  const openAddModal = () => {
    setEditingPersonId(null)
    setNewName("")
    setNewRelation("")
    setTempImages([])
    setModalVisible(true)
  }

  const openEditModal = (person) => {
    setEditingPersonId(person.id)
    setNewName(person.name)
    setNewRelation(person.relation)
    setTempImages(person.images || [])
    setModalVisible(true)
  }

  const closeModal = () => {
    setModalVisible(false)
    setTempImages([])
    setEditingPersonId(null)
    setIsUploading(false)
  }


  // ---------- UI ----------
  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Recognized Faces</Text>
        <Text style={styles.headerSubtitle}>
          People Cognia can identify for the patient.
        </Text>

        {people.map((person, i) => (
          <AnimatedPersonCard
            key={person.id}
            person={person}
            index={i}
            onPress={openEditModal}
          />
        ))}
      </ScrollView>


      {/* Floating Add Button */}
      <Pressable style={styles.fab} onPress={openAddModal}>
        <Ionicons name="camera" size={24} color="#FFF" />
        <Text style={styles.fabText}>Add Person</Text>
      </Pressable>


      {/* ---------- Modal ---------- */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingPersonId ? "Edit Details" : "Add Details"}
              </Text>

              {editingPersonId && (
                <Pressable onPress={confirmDeletePerson}>
                  <Ionicons name="trash-outline" size={24} color="#EF4444" />
                </Pressable>
              )}
            </View>

            {/* Image Upload */}
            {tempImages.length === 0 ? (
              <Pressable style={styles.emptyImageUpload} onPress={pickImages}>
                <Ionicons name="images-outline" size={40} color="#94A3B8" />
                <Text style={styles.emptyImageUploadText}>Tap to add photos</Text>
              </Pressable>
            ) : (
              <Image source={{ uri: tempImages[0] }} style={styles.imagePreview} />
            )}

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newName}
              onChangeText={setNewName}
            />

            <TextInput
              style={styles.input}
              placeholder="Relationship"
              value={newRelation}
              onChangeText={setNewRelation}
            />

            {isUploading && (
              <ActivityIndicator size="small" color="#000" />
            )}

            <View style={styles.modalActions}>
              <Pressable style={styles.cancelBtn} onPress={closeModal}>
                <Text>Cancel</Text>
              </Pressable>

              <Pressable style={styles.saveBtn} onPress={savePerson}>
                <Text style={styles.saveBtnText}>
                  {editingPersonId ? "Update" : "Save"}
                </Text>
              </Pressable>
            </View>

          </View>
        </View>
      </Modal>

    </View>
  )
}