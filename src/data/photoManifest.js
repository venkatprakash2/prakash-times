const imageModules = import.meta.glob('../../images/*.{jpeg,jpg,png,webp,avif}', {
  eager: true,
  import: 'default',
})

const clusterCycle = [
  'Home Dispatches',
  'Celebrations',
  'Travel Notes',
  'Work Notes',
  'Family Portraits',
  'Milestones',
  'Everyday Rituals',
]

const storyCycle = [
  'A warm frame from the family archive, kept in the newspaper style the project uses everywhere else.',
  'A candid moment that belongs on the front page because it says something true about the people in it.',
  'A travel-memory note that feels like an editorial photograph from the road.',
  'A quieter image, the kind that gains meaning when it sits inside a larger family story.',
  'A celebration slice from the archive, where the room itself feels part of the memory.',
  'A portrait-like moment that rewards a slower look and a longer caption.',
  'A day-to-day image that still matters because it helps complete the paper.',
]

const titleWords = ['Frame', 'Edition', 'Portrait', 'Dispatch', 'Moment', 'Page', 'Feature']

function titleFromIndex(index) {
  const titleWord = titleWords[index % titleWords.length]
  return `${titleWord} ${String(index + 1).padStart(2, '0')}`
}

const sortedImageEntries = Object.entries(imageModules).sort(([left], [right]) =>
  left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' }),
)

export const photoManifest = sortedImageEntries.map(([path, image], index) => {
  const filename = path.split('/').pop() ?? `photo-${index + 1}`
  const cluster = clusterCycle[index % clusterCycle.length]
  const story = storyCycle[index % storyCycle.length]

  return {
    id: `photo-${String(index + 1).padStart(2, '0')}`,
    filename,
    image,
    title: titleFromIndex(index),
    location: cluster === 'Travel Notes' ? 'Roadside' : cluster === 'Celebrations' ? 'Family room' : cluster === 'Work Notes' ? 'Desk corner' : 'Home',
    cluster,
    story,
    caption: `${cluster} / local archive`,
  }
})

export const photoClusters = ['All', ...new Set(photoManifest.map((photo) => photo.cluster))]

export const featuredPhotos = photoManifest.slice(0, 6)
