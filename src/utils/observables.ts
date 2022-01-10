import {
  TrackedSubject,
  TrackedComputedSubject,
  isTrackableEntity,
  Trackable,
  TrackedArray,
} from 'reactive-observables';
import { Ref, ref, watch } from 'vue';

export const isTrackable = <T> (object: any): object is (TrackedSubject<T> | TrackedComputedSubject<T>) =>
  object instanceof TrackedSubject || object instanceof TrackedComputedSubject || isTrackableEntity(object);

export const unwrapTrackable = <T> (object: T | Trackable<T>): T =>
  isTrackable(object) ? object.value : object;

export const trackable = <T> (initialValue: T): TrackedSubject<T> =>
  new TrackedSubject(initialValue);

export const trackableArray = <T> (initialValue: T[]): TrackedArray<T> =>
  new TrackedArray(initialValue);

export const computed = <T> (getter: () => T): TrackedComputedSubject<T> =>
  new TrackedComputedSubject(getter);

export const syncRef = <T> (subject: TrackedSubject<T>): Ref<T> => {
  const vueRef = ref(subject.value) as Ref<T>;
  watch(vueRef, value => subject.value = value);
  subject.subscribe(value => vueRef.value = value);
  return vueRef;
};
